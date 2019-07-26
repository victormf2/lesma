import { FormatSpecifier } from "../format-specifier";
import { DisplayMetadata } from "../metadata";

export function Format(format: FormatSpecifier): PropertyDecorator | ParameterDecorator {
    const decorator = function(target: Object, propertyName: string, parameterIndex?: number) {
        DisplayMetadata.setFormat(format, target.constructor, propertyName, parameterIndex);
    }
    return decorator;
}