import { IValidator } from "../validator";
import { ValidationMetadata } from "../metadata";
import { Constructor } from "../../_types";

export function Validate<T, V = any>(validator: IValidator<T, V>): ClassDecorator | PropertyDecorator | ParameterDecorator {
    const decorator = (target: Constructor, propertyKey?: string, parameterIndex?: number) => {
        if (typeof propertyKey === "undefined") {
            ValidationMetadata.addClassValidator(target, validator);
        } else if (typeof parameterIndex === "undefined") {
            ValidationMetadata.addPropertyValidator(target, propertyKey, validator);
        } else if (typeof parameterIndex === "number") {
            ValidationMetadata.addParameterValidator(target, propertyKey, parameterIndex, validator);
        }
    }
    return decorator;
}