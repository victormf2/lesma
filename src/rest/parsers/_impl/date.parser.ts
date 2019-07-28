import { IParser } from "../parser";
import { ParseResult, ParseError } from "../parse-result";
import { Injectable, Scope } from "../../..";

@Injectable(Scope.Singleton)
export class DefaultDateParser implements IParser<Date> {
    parse(rawValue: any): ParseResult<Date> {
        const date = new Date(rawValue);
        return isNaN(date.getTime()) ? ParseError.InvalidFormat : date;
    }
}