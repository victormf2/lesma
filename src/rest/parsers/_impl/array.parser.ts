import { IParser } from "../parser";
import { TypeInfo } from "../../../metadata";
import { ParseResult, ParseError } from "../parse-result";
import { ParserProvider } from "../parser-provider";
import { Injectable, Scope } from "../../../caracol";

@Injectable(Scope.Context)
export class DefaultArrayParser implements IParser<any[]> {

    constructor(
        private provider: ParserProvider
    ) {

    }

    async parse(array: any, typeInfo: TypeInfo): Promise<ParseResult<any[]>> {
        if (!Array.isArray(array)) {
            return ParseError.InvalidFormat;
        }
        if (!typeInfo.parameters || !typeInfo.parameters.length) {
            return array;
        }
        const elementType = typeInfo.parameters[0];
        const elementParser = this.provider.get<any>(elementType);
        if (!elementParser) {
            return array;
        }
        const getElements = array.map(rawValue => elementParser.parse(rawValue, elementType));
        const elements = await Promise.all(getElements);
        return elements;
    }

}