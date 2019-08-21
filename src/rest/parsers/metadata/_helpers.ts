import { Type } from "../../../_types";
import { Metadata } from "../../../metadata";

const ParserMetadataKey = "lesma:parser";
export function setParserKey(parserKey: string | Type, constructor: Type, property: string | symbol | number) {
    const parsers = Metadata.getMapMetadata<string | symbol | number, string | Type>(ParserMetadataKey, constructor.prototype);
    parsers.set(property, parserKey);
}
export function getParserKey(constructor: Type, property: string | symbol | number): string | Type {
    const parsers = Metadata.getMapMetadata<string | symbol | number, string | Type>(ParserMetadataKey, constructor.prototype);
    return parsers.get(property);
}