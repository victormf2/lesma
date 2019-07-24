import { Constructor } from "../../_types";
import { IValidator } from "../validator";
import { Metadata } from "../../metadata";

const ClassValidatorsMetadataKey = "lesma:class-validators";
export function addClassValidator<T>(constructor: Constructor<T>, validator: IValidator<T>) {
    const validators = getClassValidators(constructor);
    validators.push(validator);
}
export function getClassValidators<T>(constructor: Constructor<T>) {
    return Metadata.getArrayMetadata<IValidator<T>>(ClassValidatorsMetadataKey, constructor);
}

const PropertyValidatorsMetadataKey = "lesma:property-validators";
export function addPropertyValidator<T, V>(constructor: Constructor, propertyName: string, validator: IValidator<T, V>) {
    const validators = getPropertyValidators(constructor, propertyName);
    validators.push(validator);
}
export function getPropertyValidators<T, V>(constructor: Constructor, propertyName: string) {
    return Metadata.getArrayMetadata<IValidator<T,V>>(PropertyValidatorsMetadataKey, constructor, propertyName);
}

const ParameterValidatorsMetadataKey = "lesma:parameter-validators";
export function addParameterValidator<T, V>(constructor: Constructor, methodName: string, parameterIndex: number, validator: IValidator<T, V>) {
    const validators = getParameterValidators(constructor, methodName, parameterIndex);
    validators.push(validator);
}
export function getParameterValidators<T, V>(constructor: Constructor, methodName: string, parameterIndex: number) {
    return Metadata.getArrayMetadata<IValidator<T,V>>(ParameterValidatorsMetadataKey, constructor, methodName, parameterIndex);
}