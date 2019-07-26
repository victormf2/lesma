type FailMessageGenerator<T, V> = <T, V>(propertyName: string, value: V, instance: T) => string;
export type FailMessage<T = any, V = any> = string | FailMessageGenerator<T, V>;

export class ValidationResult {
    constructor(
        readonly isValid: boolean,
        readonly reason?: string
    ) {

    }

    static Success = new ValidationResult(true);

    static fail(message: string) {
        return new ValidationResult(false, message);
    }
}