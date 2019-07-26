import { ParameterInfo } from "./parameter-info";
import { Method, Constructor } from "../_types";

export const MetadataBase = new Object();

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const BETWEEN_PARENTHESIS = /\(\s*(.*?)\s*\)(?:\s*\{)/s;
const ARGUMENT_NAMES = /([a-zA-Z$_]\w*)\s*(=.*)?(,|$)/gm;

export function getParameters(constructor: Constructor, methodName: string): ParameterInfo[] {
    const parameterTypes = getParameterTypes(constructor, methodName);
    const parameters: ParameterInfo[] = [];
    const method: Method<Promise<any>> = constructor.prototype[methodName];
    const fnStr = method.toString().replace(STRIP_COMMENTS, '');
    const paramsStr = fnStr.match(BETWEEN_PARENTHESIS)[1];
    let parameterIndex = 0;
    let result = ARGUMENT_NAMES.exec(paramsStr);
    while (result) {
        const parameterInfo = new ParameterInfo(result[1], parameterTypes[parameterIndex], !!result[2]);
        parameters.push(parameterInfo);
        result = ARGUMENT_NAMES.exec(paramsStr);
        parameterIndex++;
    }
    return parameters;
}

export function getParameterTypes(constructor: Constructor, methodName: string): Constructor[] {
    const paramTypes = Reflect.getMetadata("design:paramtypes", constructor.prototype, methodName);
    return paramTypes;
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

    let map = getMapMetadata<any, T[]>(metadataKey, target, propertyKey);
    if (!map.has(descriptor)) {
        map.set(descriptor, []);
    }
    return map.get(descriptor);
}

export function getMapMetadata<K, V>(metadataKey: string, target: Object, propertyKey: string) {
    let map: Map<K, V> = Reflect.getMetadata(metadataKey, target, propertyKey);
    if (!map) {
        map = new Map<K, V>();
        Reflect.defineMetadata(metadataKey, map, target, propertyKey);
    }
    return map;
}