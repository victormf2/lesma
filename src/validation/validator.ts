import { ValidationResult } from "./validation-result";

export interface IValidator<T = any, V = any> {
    (value: V, instance: T, propertyName?: string): ValidationResult | Promise<ValidationResult>
}