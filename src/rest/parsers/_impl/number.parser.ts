import { IParser } from "../parser";
import { ParseResult, ParseError } from "../parse-result";
import { Injectable, Scope } from "../../..";

@Injectable(Scope.Singleton)
export class DefaultNumberParser implements IParser<number> {

    parse(rawValue: any): ParseResult<number> {
        const num = Number(rawValue);
        return isNaN(num) ? ParseError.InvalidFormat : num;
    }

}