import * as path from "path";
import { HttpMethod } from "../types";
import { ActionMetadata } from "./action-metadata";
import { ControllerMetadata } from "./controller-metadata";
import { DefaultModelBinding, getBindingTarget } from "./model-binding";

export class RouteBinding {
    constructor(
        readonly httpMethod: HttpMethod,
        readonly path: string,
        readonly controller: ControllerMetadata,
        readonly action: ActionMetadata,
    ) {

    }
}

export class RoutingMetadata {
    private _routeBindings: RouteBinding[] = [];
    constructor(controllers: ControllerMetadata[]) {
        controllers.forEach(controllerMetadata => {
            this.addControllerRouteBindings(controllerMetadata.route, controllerMetadata);
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
            actionMetadata.modelBindings.push(modelBinding);
        }
    }

    private addActionRouteBinding(httpMethod: HttpMethod, path: string, controllerMetadata: ControllerMetadata, actionMetadata: ActionMetadata) {
        const routeBinding = new RouteBinding(
            httpMethod,
            path,
            controllerMetadata,
            actionMetadata,
        );
        this._routeBindings.push(routeBinding);
    }
}

