import { ActionRouteInfo } from "./action-route-info";
import { Method } from "../../_types";
import { ModelBindingInfo } from "./model-binding-info";
import { ParameterInfo, Metadata } from "../../metadata";

export class ActionInfo {

    readonly parameters: ParameterInfo[]
    readonly controllerMethod: Method<Promise<any>>;
    constructor(
        readonly controllerPrototype: Object,
        controllerMethodName: string,
        readonly routes: ActionRouteInfo[],
        readonly modelBindings: ModelBindingInfo[],
    ) {
        this.controllerMethod = (controllerPrototype as any)[controllerMethodName];
        this.parameters = Metadata.getParameters(controllerPrototype, controllerMethodName);
    }
}