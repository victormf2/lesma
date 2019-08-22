import { IParser } from "../parser";
import { ParseResult, ParseError } from "../parse-result";
import { Injectable, Scope } from "../../../caracol";
import { RawValue, RawValueType } from "../..";
import { typeOfOrNull, assertNever } from "../../../_helpers";

@Injectable(Scope.Singleton)
export class DefaultBooleanParser implements IParser<boolean> {
    parse(rawValue: RawValue): ParseResult<boolean> {
        if (rawValue.type === RawValueType.String) {
            return rawValue.value != null && 
                rawValue.value !== "" && 
                rawValue.value.toLowerCase() !== "false"
        } else if (rawValue.type === RawValueType.Json) {
            return typeOfOrNull(rawValue.value, "boolean") ? rawValue.value : ParseError.InvalidFormat
        }
        return assertNever(rawValue.type)
    }
}