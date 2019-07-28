import { Constructor } from "../_types";
import { TypeInfo } from "../metadata/type-info";

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
 * &#64;Type(Array, [Map, [String, [Array, Number]]])
 * readonly mappings: Map<string, number[]>[]
 * ```
 * @param type The main type.
 * @param parameters The generic type parameters if any. You may also provide nested generic type parameters 
 */
export function Type(type: Constructor, parameters?: any): ParameterDecorator | PropertyDecorator {
    const decorator: ParameterDecorator | PropertyDecorator = function(prototype, propertyKey, parameterIndex) {

    };
    return decorator;
}

function buildTypeInfo(type: Constructor, parameters?: any): TypeInfo {
    const typeInfo = new TypeInfo(type, getParametersTypeInfo(parameters));
    return typeInfo
}

function getParametersTypeInfo(parameters: any) {
    if (!parameters) {
        return undefined;
    }
    const wrapped = Array.isArray(parameters) ? parameters : [parameters];
    if (!wrapped.length) {
        return undefined;
    }
    return wrapped.map(p => Array.isArray(p) ? buildTypeInfo(p[0], p.slice(1)) : buildTypeInfo(p));
}