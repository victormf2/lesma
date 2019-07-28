import { IParser } from "../parser";
import { ParseResult } from "../parse-result";
import { Injectable, Scope } from "../../../caracol";

@Injectable(Scope.Singleton)
export class DefaultBooleanParser implements IParser<boolean> {
    parse(rawValue: any): ParseResult<boolean> {
        return rawValue && `${rawValue}`.toLowerCase() !== "false";
    }
}