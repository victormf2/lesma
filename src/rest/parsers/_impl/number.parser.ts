import { IParser } from "../parser";
import { ParseResult, ParseError } from "../parse-result";
import { Injectable, Scope } from "../../..";
import { RawValue, RawValueType } from "../../metadata";
import { assertNever, typeOfOrNull } from "../../../_helpers";

@Injectable(Scope.Singleton)
export class DefaultNumberParser implements IParser<number> {

    parse(rawValue: RawValue): ParseResult<number> {
        if (rawValue.type === RawValueType.String) {
            if (!rawValue.value) {
                return rawValue.value === "" ? null : rawValue.value
            }
            const num = Number(rawValue);
            return isNaN(num) ? ParseError.InvalidFormat : num;
        } else if (rawValue.type === RawValueType.Json) {
            return typeOfOrNull(rawValue.value, "number") ? rawValue.value : ParseError.InvalidFormat
        }
        return assertNever(rawValue.type)
    }

}