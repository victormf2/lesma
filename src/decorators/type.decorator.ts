import { Constructor } from "../_types"
import { TypeInfo } from "../metadata/type-info"
import { Metadata } from "../metadata"

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
export function Type(type: Constructor, parameters?: any[]): ParameterDecorator | PropertyDecorator {
    const decorator: ParameterDecorator | PropertyDecorator = function(target, propertyKey, parameterIndex) {
        const typeInfo = buildTypeInfo(type, parameters)
        Metadata.setType(typeInfo, propertyKey ? target.constructor : target as any, propertyKey, parameterIndex)
    }
    return decorator
}

function buildTypeInfo(type: Constructor, parameters?: any[]): TypeInfo {
    const typeInfo = new TypeInfo(type, getParametersTypeInfo(parameters))
    return typeInfo
}

function getParametersTypeInfo(parameters: any[]) {
    if (!parameters || !parameters.length) {
        return undefined
    }
    if (parameters.length === 2 && Array.isArray(parameters[1])) {
        return [buildTypeInfo(parameters[0], parameters[1])]
    }
    return parameters.map(p => buildTypeInfo(p))
}