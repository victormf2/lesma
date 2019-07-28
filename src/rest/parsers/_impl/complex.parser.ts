import { IParser } from "../parser"
import { ParseResult, ParseError } from "../parse-result"
import { TypeInfo, Metadata, ParameterInfo } from "../../../metadata"
import { Caracol, Injectable, Scope } from "../../../caracol"
import { RestContext } from "../../rest-context"
import { ParserProvider } from "../parser-provider"
import { ParserMetadata } from "../metadata"
import { Constructor } from "../../../_types"
import { RestMetadata } from "../.."
import { getParamRawValues } from "../../model-binding"

@Injectable(Scope.Context)
export class DefaultComplexParser implements IParser<any> {

    constructor(
        private caracol: Caracol<RestContext>,
        private provider: ParserProvider,
    ) {
    }

    async parse(body: any, typeInfo: TypeInfo): Promise<ParseResult<any>> {
        if (typeof body !== "object") {
            return ParseError.InvalidFormat
        }
        const constructor = typeInfo.type
        const parameters = Metadata.getParameters(constructor)
        const modelBindings = RestMetadata.getModelBindings(constructor)
        const rawValues = await getParamRawValues(this.caracol.ctx, parameters, modelBindings)
        const getConstructorValues = parameters.map(async parameter => {
            let rawValue = rawValues[parameter.index]
            if (typeof rawValue === "undefined") {
                rawValue = body[parameter.name]
            }
            if (rawValue == null) {
                return rawValue
            }
            const parser = this.getParser(constructor, parameter)
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
        return new constructor(...constructorValues)
    }

    private getParser(constructor: Constructor, parameter: ParameterInfo): IParser<any> {
        const parserKey = ParserMetadata.getParserKey(constructor, parameter.index)
        return parserKey ? this.caracol.get(parserKey) : this.provider.get<any>(parameter.type)
    }
}