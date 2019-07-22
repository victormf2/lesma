import * as path from "path";
import { ControllerMetadata } from "./controller-metadata";
import { HttpMethod, Constructor, ControllerMethod } from "../types";
import { ModelBindingMetadata, DefaultModelBinding, getBindingTarget } from "./model-binding";
import { ActionMetadata } from "./action-metadata";
import { ParameterInfo } from "./parameter-metadata";

export class RouteBinding {
    constructor(
        readonly httpMethod: HttpMethod,
        readonly path: string,
        readonly controllerConstructor: Constructor,
        readonly controllerMethod: ControllerMethod,
        readonly modelBindings: Iterable<ModelBindingMetadata>,
        readonly parameters: ArrayLike<ParameterInfo>,
    ) {

    }
}

export class RoutingMetadata {
    private _routeBindings: RouteBinding[] = [];
    constructor(controllers: Map<Object, ControllerMetadata>) {
        controllers.forEach(controllerMetadata => {
            controllerMetadata.routes.forEach(basePath => {
                this.addControllerRouteBindings(basePath, controllerMetadata);
            });
        }); 
    }

    get routeBindings(): Iterable<RouteBinding> {
        return this._routeBindings;
    }

    private addControllerRouteBindings(basePath: string, controllerMetadata: ControllerMetadata) {
        controllerMetadata.actions.forEach(actionMetadata => {
            this.fillMissingParameterBindings(actionMetadata);
            for (let route of actionMetadata.routes) {
                const fullPath = route.isRoot ?
                    path.posix.join("/", route.path) : 
                    path.posix.join("/", basePath, route.path);
                this.addActionRouteBinding(route.httpMethod, fullPath, controllerMetadata, actionMetadata);
            }
        });
    }

    private fillMissingParameterBindings(actionMetadata: ActionMetadata) {
        const missingBindings = new Array<boolean>(actionMetadata.parameters.length).fill(true);
    
        for (let modelBinding of actionMetadata.modelBindings) {
            missingBindings[modelBinding.target.parameterIndex] = false;
        }

        for (let parameterIndex = 0; parameterIndex < actionMetadata.parameters.length; parameterIndex++) {
            if (!missingBindings[parameterIndex]) continue;
            const target = getBindingTarget(actionMetadata.controllerPrototype, actionMetadata.controllerMethod.name, parameterIndex)
            const modelBinding = new DefaultModelBinding(target);
            actionMetadata.addModelBinding(modelBinding);
        }
    }

    private addActionRouteBinding(httpMethod: HttpMethod, path: string, controllerMetadata: ControllerMetadata, actionMetadata: ActionMetadata) {
        const controllerConstructor = controllerMetadata.controllerConstructor;
        const controllerMethod = actionMetadata.controllerMethod;
        const modelBindings = actionMetadata.modelBindings;
        const parameters = actionMetadata.parameters;
        const routeBinding = new RouteBinding(
            httpMethod,
            path,
            controllerConstructor,
            controllerMethod,
            modelBindings,
            parameters
        );
        this._routeBindings.push(routeBinding);
    }
}

