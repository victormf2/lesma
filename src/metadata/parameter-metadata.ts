import "reflect-metadata";
import { Constructor, ControllerMethod } from "../types";

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const BETWEEN_PARENTHESIS = /\(\s*(.*?)\s*\)(?:\s*\{)/s;
const ARGUMENT_NAMES = /([a-zA-Z$_]\w*)\s*(=.*)?(,|$)/gm;

export class ParameterInfo {
    constructor(
        readonly name: string,
        readonly type: Constructor,
        readonly hasDefaultValue: boolean,
    ) {

    }
}
export function getParameters(prototype: Object, methodName: string): ParameterInfo[] {
    const parameterTypes = getParameterTypes(prototype, methodName);
    const parameters: ParameterInfo[] = [];
    const method: ControllerMethod = (prototype as any)[methodName];
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

export function getParameterTypes(prototype: Object, methodName: string): Constructor[] {
    const paramTypes = Reflect.getMetadata("design:paramtypes", prototype, methodName);
    return paramTypes;
}