import { RouteMetadata } from "./route-metadata";
import { ModelBindingMetadata } from "./model-binding";
import { ControllerMethod } from "../types";
import { ParameterInfo, getParameters } from "./parameter-metadata";

export class ActionMetadata {

    private _routes: RouteMetadata[] = [];
    private _modelBindings: ModelBindingMetadata[] = [];
    private _parameters: ParameterInfo[]
    readonly controllerMethod: ControllerMethod;
    constructor(
        readonly controllerPrototype: Object,
        controllerMethodName: string
    ) {
        this.controllerMethod = (controllerPrototype as any)[controllerMethodName];
        this._parameters = getParameters(controllerPrototype, controllerMethodName);
    }

    get routes(): Iterable<RouteMetadata> {
        return this._routes;
    }

    get modelBindings(): Iterable<ModelBindingMetadata> {
        return this._modelBindings;
    }

    get parameters(): ArrayLike<ParameterInfo> {
        return this._parameters;
    }

    addRoute(route: RouteMetadata) {
        this._routes.push(route);
    }

    addModelBinding(modelBinding: ModelBindingMetadata) {
        this._modelBindings.push(modelBinding);
    }
}