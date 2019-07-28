import { Constructor } from "../../../_types";
import { Metadata } from "../../../metadata";

const ParserMetadataKey = "lesma:parser";
export function setParserKey(parserKey: string | Constructor, constructor: Constructor | Function, property: string | symbol | number) {
    const parsers = Metadata.getMapMetadata<string | symbol | number, string | Constructor>(ParserMetadataKey, constructor.prototype);
    parsers.set(property, parserKey);
}
export function getParserKey(constructor: Constructor, property: string | symbol | number): string | Constructor {
    const parsers = Metadata.getMapMetadata<string | symbol | number, string | Constructor>(ParserMetadataKey, constructor.prototype);
    return parsers.get(property);
}