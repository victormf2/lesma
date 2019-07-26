import { Validate } from "./validation-decorator";
import { ValidationResult, FailMessage } from "../validation-result";

function requiredFailMessage(property: string) {
    return `${property} is required`;
}
export function Required<T, V>(message: FailMessage<T, V> = requiredFailMessage) : PropertyDecorator | ParameterDecorator {
    return Validate<T, V>((value, instance, propertyName) => {
        if (value || (typeof value === "number")) {
            return ValidationResult.Success;
        }
        const reason = typeof message === "string" ? message : message(propertyName, value, instance);
        return ValidationResult.fail(reason);
    });
}