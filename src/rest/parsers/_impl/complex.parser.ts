import { IParser } from "../parser"
import { ParseResult, ParseError } from "../parse-result"
import { Caracol, Injectable, Scope } from "../../../caracol"
import { RestContext } from "../../rest-context"
import { ParserProvider } from "../parser-provider"
import { TypeInfo } from "../../..";
import { RawValue, RawValueType } from "../../metadata";
import { assertNever } from "../../../_helpers";
import { getRawValueProviders, ComplexParserValueProvider } from "../../_impl";

@Injectable(Scope.Context)
export class DefaultComplexParser implements IParser<any> {

    constructor(
        private caracol: Caracol<RestContext>,
        private parserProvider: ParserProvider,
    ) {
    }

    async parse(rawValue: RawValue, typeInfo: TypeInfo): Promise<ParseResult<any>> {
        if (rawValue.type === RawValueType.String) {
            throw new Error("Complex type parsing of strings not implemented.")
        } else if (rawValue.type === RawValueType.Json) {
            const body = rawValue.value
            if (body == null) {
                return body
            }
            if (typeof body !== "object") {
                return ParseError.InvalidFormat
            }
            const parameters = typeInfo.ctor.parameters
            const valueProviders = getRawValueProviders(parameters, parameter => new ComplexParserValueProvider(parameter, body))
            const getConstructorValues = valueProviders.map(async (valueProvider, index) => {
                const parameter = parameters[index]
                const rawValue = await valueProvider.getRawValue(this.caracol.ctx)
                //TODO check for ParserDecorator (build a ParseInfo instead of everytime gather that info)
                const parser = this.parserProvider.get<any>(parameter.type)
                if (!parser) {
                    return rawValue
                }
                const value = await parser.parse(rawValue, parameter.type)
                return value
            })
            const constructorValues = await Promise.all(getConstructorValues)
            if (constructorValues.some(c => c === ParseError.InvalidFormat)) {
                return ParseError.InvalidFormat
            }
            return new typeInfo.type(...constructorValues)
        }
        return assertNever(rawValue.type)
    }
}