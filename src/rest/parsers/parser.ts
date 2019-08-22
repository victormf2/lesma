import { ParseResult } from "./parse-result";
import { TypeInfo } from "../..";
import { RawValue } from "../metadata/raw-value";

export interface IParser<T> {
    parse(rawValue: RawValue, typeInfo: TypeInfo): ParseResult<T> | Promise<ParseResult<T>>
}
