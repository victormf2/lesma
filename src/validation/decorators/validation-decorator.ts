// import { IValidator } from "../validator";
// import { ValidationMetadata } from "../metadata";
// import { decorate } from "../../_helpers";

// export function Validate<T, V = any>(validator: IValidator<T, V>): ClassDecorator | PropertyDecorator | ParameterDecorator {
//     const decorator = decorate()
//     .class(target => ValidationMetadata.addClassValidator(target, validator))
//     .property((target, propertyName) => ValidationMetadata.addPropertyValidator(target, propertyName, validator))
//     .parameter((target, methodName, parameterIndex) => ValidationMetadata.addParameterValidator(target, methodName, parameterIndex, validator))
//     return decorator.value()
// }