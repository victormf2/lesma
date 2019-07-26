import { DisplayMetadata } from "../metadata";

export function Label(label: string): PropertyDecorator | ParameterDecorator {
    const decorator = function(target: Object, propertyName: string, parameterIndex?: number) {
        DisplayMetadata.setLabel(label, target.constructor, propertyName, parameterIndex);
    }
    return decorator;
}