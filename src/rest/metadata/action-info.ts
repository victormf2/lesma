import { ActionRouteInfo } from "./action-route-info";
import { Method, Constructor } from "../../_types";
import { ModelBindingInfo } from "./model-binding-info";
import { ParameterInfo, Metadata } from "../../metadata";

export class ActionInfo {

    readonly parameters: ParameterInfo[]
    readonly controllerMethod: Method<Promise<any>>;
    constructor(
        readonly controllerConstructor: Constructor,
        controllerMethodName: string,
        readonly routes: ActionRouteInfo[],
        readonly modelBindings: ModelBindingInfo[],
    ) {
        this.controllerMethod = controllerConstructor.prototype[controllerMethodName];
        this.parameters = Metadata.getParameters(controllerConstructor, controllerMethodName);
    }
}