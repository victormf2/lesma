import { ParameterInfo } from "./parameter-info";
import { Method, Constructor } from "../_types";
import { TypeInfo } from "./type-info";

export const MetadataBase = new Object();

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const BETWEEN_PARENTHESIS = /\(\s*(.*?)\s*\)(?:\s*\{)/s;
const ARGUMENT_NAMES = /([a-zA-Z$_]\w*)\s*(=.*)?(,|$)/gm;

export function getParameters(constructor: Constructor, methodName?: string): ParameterInfo[] {
    let parameters: ParameterInfo[] = Reflect.getMetadata("lesma:method-parameters", constructor.prototype, methodName);
    if (!parameters) {
        const parameterTypes = getParameterTypes(constructor, methodName);
        parameters = new Array(parameterTypes.length);
        const method: Method<Promise<any>> = constructor.prototype[methodName];
        const fnStr = method.toString().replace(STRIP_COMMENTS, '');
        const paramsStr = fnStr.match(BETWEEN_PARENTHESIS)[1];
        let parameterIndex = 0;
        let result = ARGUMENT_NAMES.exec(paramsStr);
        while (result) {
            const parameterInfo = new ParameterInfo(parameterIndex, result[1], parameterTypes[parameterIndex], !!result[2]);
            parameters.push(parameterInfo);
            result = ARGUMENT_NAMES.exec(paramsStr);
            parameterIndex++;
        }
        Reflect.defineMetadata("lesma:method-parameters", parameters, constructor.prototype, methodName);
    }
    return parameters;
}

export function getParameterTypes(constructor: Constructor, methodName?: string): TypeInfo[] {
    let lesmaParamTypes: TypeInfo[] = Reflect.getMetadata("lesma:paramtypes", constructor.prototype, methodName);
    if (!lesmaParamTypes) {
        const paramTypes: Constructor[] = Reflect.getMetadata("design:paramtypes", constructor.prototype, methodName);
        lesmaParamTypes = paramTypes.map(p => new TypeInfo(p))
        Reflect.defineMetadata("lesma:paramtypes", lesmaParamTypes, constructor.prototype, methodName);
    }
    return lesmaParamTypes;
}

export function setType(constructor: Constructor, propertyKey: string, parameterIndex: number, type: TypeInfo) {
    if (typeof parameterIndex === "number") {
        const paramTypes = getParameterTypes(constructor, propertyKey);
        paramTypes[parameterIndex] = type;
    } else {
        throw new Error("Property types not yet implemented.");
    }
}

export function getArrayMetadata<T>(metadataKey: string, target: Object, propertyKey?: string, descriptor?: any): T[] {
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