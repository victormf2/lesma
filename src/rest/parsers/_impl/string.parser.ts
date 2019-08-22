import { IParser } from "../parser";
import { ParseResult, ParseError } from "../parse-result";
import { Injectable, Scope } from "../../..";
import { RawValue, RawValueType } from "../../metadata";
import { assertNever } from "../../../_helpers";

@Injectable(Scope.Singleton)
export class DefaultStringParser implements IParser<string> {

    parse(rawValue: RawValue): ParseResult<string> {
        if (rawValue.type === RawValueType.String) {
            return rawValue.value
        } else if (rawValue.type === RawValueType.Json) {
            return typeof rawValue.value === "string" ? rawValue.value : ParseError.InvalidFormat;
        }
        return assertNever(rawValue.type)
    }
}