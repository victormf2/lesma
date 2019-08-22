import { IParser } from "../parser";
import { ParseResult, ParseError } from "../parse-result";
import { ParserProvider } from "../parser-provider";
import { Injectable, Scope } from "../../../caracol";
import { TypeInfo } from "../../..";
import { RawValue, RawValueType } from "../../metadata";
import { assertNever } from "../../../_helpers";

@Injectable(Scope.Context)
export class DefaultArrayParser implements IParser<any[]> {

    constructor(
        private provider: ParserProvider
    ) {

    }

    async parse(rawValue: RawValue, typeInfo: TypeInfo): Promise<ParseResult<any[]>> {
        if (rawValue.type === RawValueType.String) {
            throw new Error("Array parsing of strings not implemented.")
        } else if (rawValue.type === RawValueType.Json) {
            const array = rawValue.value
            if (array == null) {
                return array
            }
            if (!Array.isArray(array)) {
                return ParseError.InvalidFormat;
            }
            if (!typeInfo.genericParameters || !typeInfo.genericParameters.length) {
                return array;
            }
            const elementType = typeInfo.genericParameters[0];
            const elementParser = this.provider.get<any>(elementType);
            if (!elementParser) {
                return array;
            }
            const getElements = array.map(rawValue => elementParser.parse(rawValue, elementType));
            const elements = await Promise.all(getElements);
            return elements;
        }
        return assertNever(rawValue.type)
    }

}