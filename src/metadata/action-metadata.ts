import { RouteMetadata } from "./route-metadata";
import { ModelBindingMetadata } from "./model-binding";

export class ActionMetadata {

    constructor(
        readonly controllerMethod: (...args: any[]) => Promise<any>
    ) {
    }
    private _routes: RouteMetadata[] = [];
    private _modelBindings: ModelBindingMetadata[] = [];

    get routes(): Iterable<RouteMetadata> {
        return this._routes;
    }

    addRoute(route: RouteMetadata) {
        this._routes.push(route);
    }

    addModelBinding(modelBinding: ModelBindingMetadata) {
        this._modelBindings.push(modelBinding);
    }
}