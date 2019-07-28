import { Constructor } from "../../../_types";
import { ParserMetadata } from "../metadata";

export function Parser(key: string | Constructor): ParameterDecorator | PropertyDecorator {
    const decorator: ParameterDecorator | PropertyDecorator = function (tager, propertyKey, parameterIndex) {
        const property = typeof parameterIndex === "number" ? parameterIndex : propertyKey;
        ParserMetadata.setParserKey(key, tager.constructor, property)
    }
    return decorator;
}