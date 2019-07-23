import { RouteMetadata } from "./route-metadata";
import { ModelBindingMetadata } from "./model-binding";
import { ControllerMethod } from "../types";
import { ParameterInfo, getParameters } from "./parameter-metadata";

export class ActionMetadata {

    readonly parameters: ParameterInfo[]
    readonly controllerMethod: ControllerMethod;
    constructor(
        readonly controllerPrototype: Object,
        controllerMethodName: string,
        readonly routes: RouteMetadata[],
        readonly modelBindings: ModelBindingMetadata[],
    ) {
        this.controllerMethod = (controllerPrototype as any)[controllerMethodName];
        this.parameters = getParameters(controllerPrototype, controllerMethodName);
    }
}