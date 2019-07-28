import { IParser } from "../parser";
import { ParseResult, ParseError } from "../parse-result";
import { Injectable, Scope } from "../../..";

@Injectable(Scope.Singleton)
export class DefaultStringParser implements IParser<string> {

    parse(rawValue: any): ParseResult<string> {
        return typeof rawValue === "string" ? rawValue : ParseError.InvalidFormat;
    }
}