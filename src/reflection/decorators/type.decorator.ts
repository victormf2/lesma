import { Type } from "../../_types"
import { decorate } from "../../_helpers";
import { ReflectionMetadata } from "..";

/**
 * Use this decorator to apply type information metadata to method parameters and class properties.
 * As generic type parameters are not serialized on metadata generation, it is necessary to manually declare those.
 * 
 * Examples:
 * &#64;Type(Array, Number)
 * readonly items: number[]
 * 
 * &#64;Type(Map, [String, User])
 * readonly users: Map<string, User>
 * 
 * &#64;Type(Array, [Map, [[Array, Number], String]])
 * readonly mappings: Map<number[], string>[]
 * ```
 * @param type The main type.
 * @param genericParameters The generic type parameters if any. You may also provide nested generic type parameters 
 */
export function Type(type: Type, genericParameters?: any[]): ParameterDecorator | PropertyDecorator {
    const decorator = decorate()
    .parameter((target, methodName, parameterIndex) => {
        ReflectionMetadata.setMethodParameterType(target, methodName, parameterIndex, type, genericParameters)
    })
    .ctorParam((target, parameterIndex) => {
        ReflectionMetadata.setConstructorParameterType(target, parameterIndex, type, genericParameters)
    })
    .property((target, propertyName) => {
        ReflectionMetadata.setPropertyType(target, propertyName, type, genericParameters)
    })
    return decorator.value()
}