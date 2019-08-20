import { ParameterInfo } from "./parameter-info";
import { Method, Constructor } from "../_types";
import { TypeInfo } from "./type-info";

export const MetadataBase = new Object()

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
const BETWEEN_PARENTHESIS = /\(\s*(.*?)\s*\)(?:\s*\{)/s
const ARGUMENT_NAMES = /([a-zA-Z$_]\w*)\s*(=.*)?(,|$)/gm
const CONSTRUCTOR_FUNCTION = /[^\w\s]\s*(constructor\s*\()/

export function getParameters(constructor: Constructor, methodName?: string): ParameterInfo[] {
    let parameters: ParameterInfo[] = Reflect.getMetadata("lesma:method-parameters", constructor.prototype, methodName)
    if (!parameters) {
        const parameterTypes = getParameterTypes(constructor, methodName)
        parameters = new Array(parameterTypes.length)
        const fnStr: string = getFnString(constructor, methodName)
        const uncommented = fnStr.replace(STRIP_COMMENTS, '')
        const paramsStr = uncommented.match(BETWEEN_PARENTHESIS)[1]
        let parameterIndex = 0
        let result = ARGUMENT_NAMES.exec(paramsStr)
        while (result) {
            const parameterInfo = new ParameterInfo(parameterIndex, result[1], parameterTypes[parameterIndex], !!result[2])
            parameters[parameterIndex] = parameterInfo
            result = ARGUMENT_NAMES.exec(paramsStr)
            parameterIndex++
        }
        Reflect.defineMetadata("lesma:method-parameters", parameters, constructor.prototype, methodName)
    }
    return parameters
}

function getFnString(constructor: Constructor, methodName: string) {
    if (methodName) {
        const method: Method<Promise<any>> = constructor.prototype[methodName]
        return method.toString()
    }
    const match = constructor.toString().match(CONSTRUCTOR_FUNCTION)
    const ix = indexOfGroup(match)
    return match.input.slice(ix);
}

function indexOfGroup(match: RegExpMatchArray) {
    let length = match[0].length - match[1].length
    return match.index + length
}

export function getParameterTypes(constructor: Constructor, methodName?: string): TypeInfo[] {
    let lesmaParamTypes: TypeInfo[] = Reflect.getMetadata("lesma:paramtypes", constructor.prototype, methodName);
    if (!lesmaParamTypes) {
        lesmaParamTypes = []
        Reflect.defineMetadata("lesma:paramtypes", lesmaParamTypes, constructor.prototype, methodName)
    }
    const hasDefinedDefaultTypes = Reflect.getMetadata("lesma:defaultparamtypes", constructor.prototype, methodName)
    if (hasDefinedDefaultTypes) {
        return lesmaParamTypes
    }
    const paramTypes: Constructor[] = Reflect.getMetadata("design:paramtypes", methodName ? constructor.prototype : constructor, methodName)
    if (!paramTypes) {
        return lesmaParamTypes
    }
    paramTypes.forEach((type, index) => {
        if (lesmaParamTypes[index]) {
            return
        }
        lesmaParamTypes[index] = new TypeInfo(type)
    })
    Reflect.defineMetadata("lesma:defaultparamtypes", true, constructor.prototype, methodName)
    return lesmaParamTypes;
}

export function setType(type: TypeInfo, constructor: Constructor, propertyKey: string | symbol, parameterIndex: number) {
    if (typeof parameterIndex === "number") {
        const paramTypes = getParameterTypes(constructor);
        paramTypes[parameterIndex] = type;
    } else {
        throw new Error("Property types not yet implemented.");
    }
}

export function getArrayMetadata<T>(metadataKey: string, target: Object, propertyKey?: string, descriptor?: any): T[] {
    // if (!propertyKey) {
    //     target = target.constructor;
    // }
    if (typeof descriptor === "undefined") {
        let metadata: T[] = Reflect.getMetadata(metadataKey, target, propertyKey);
        if (!metadata) {
            metadata = [];
            Reflect.defineMetadata(metadataKey, metadata, target, propertyKey);
        }
        return metadata;
    }

    const map = getMapMetadata<any, T[]>(metadataKey, target, propertyKey);
    if (!map.has(descriptor)) {
        map.set(descriptor, []);
    }
    return map.get(descriptor);
}

export function getMapMetadata<K, V>(metadataKey: string, target: Object, propertyKey?: string) {
    let map: Map<K, V> = Reflect.getMetadata(metadataKey, target, propertyKey);
    if (!map) {
        map = new Map();
        Reflect.defineMetadata(metadataKey, map, target, propertyKey);
    }
    return map;
}