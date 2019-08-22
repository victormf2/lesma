import { IParser } from "../parser";
import { ParseResult, ParseError } from "../parse-result";
import { Injectable, Scope } from "../../..";
import { RawValue } from "../../metadata";

@Injectable(Scope.Singleton)
export class DefaultDateParser implements IParser<Date> {
    parse(rawValue: RawValue): ParseResult<Date> {
        if (rawValue.value == null) {
            return rawValue.value
        }
        const date = new Date(rawValue.value);
        return isNaN(date.getTime()) ? ParseError.InvalidFormat : date;
    }
}