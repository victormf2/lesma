import { TypeInfo } from "../../metadata";
import { ParseResult } from "./parse-result";

export interface IParser<T> {
    parse(rawValue: any, typeInfo: TypeInfo): ParseResult<T> | Promise<ParseResult<T>>
}
