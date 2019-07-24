import { ParameterInfo } from "../../../metadata/parameter-info";
import { RestContext } from "../../rest-context";

export abstract class ModelBindingInfo {
    constructor(
        readonly target: ModelBindingTarget
    ) {}

    abstract getRawValue(ctx: RestContext, targetParameter: ParameterInfo): Promise<any>
}

export class ModelBindingTarget {
    constructor(
        readonly parameterIndex: number,
        readonly targetPath?: string // TODO parse path to build complex objects from model binding
    ) {
        
    }
}

export function getBindingTarget(controllerPrototype: Object, methodName: string, parameterIndex: number) {
    const target = new ModelBindingTarget(parameterIndex);
    return target;
}