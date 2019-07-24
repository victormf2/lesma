import * as path from "path";
import { Route } from "../routing";
import { ControllerInfo, ActionInfo, DefaultModelBinding, getBindingTarget } from "../metadata";
import { HttpMethod } from "../_types";

export class RouteCollection {
    private _routes: Route[] = [];
    constructor(controllers: ControllerInfo[]) {
        controllers.forEach(controllerMetadata => {
            this.addControllerRoute(controllerMetadata.route, controllerMetadata);
        }); 
    }

    get routes(): Route[] {
        return this._routes;
    }

    private addControllerRoute(basePath: string, controllerMetadata: ControllerInfo) {
        controllerMetadata.actions.forEach(actionMetadata => {
            this.fillMissingParameterBindings(actionMetadata);
            for (let route of actionMetadata.routes) {
                const fullPath = route.isRoot ?
                    path.posix.join("/", route.path) : 
                    path.posix.join("/", basePath, route.path);
                this.addActionRoute(route.httpMethod, fullPath, controllerMetadata, actionMetadata);
            }
        });
    }

    private fillMissingParameterBindings(actionMetadata: ActionInfo) {
        const missingBindings = new Array<boolean>(actionMetadata.parameters.length).fill(true);
    
        for (let modelBinding of actionMetadata.modelBindings) {
            missingBindings[modelBinding.target.parameterIndex] = false;
        }

        for (let parameterIndex = 0; parameterIndex < actionMetadata.parameters.length; parameterIndex++) {
            if (!missingBindings[parameterIndex]) continue;
            const target = getBindingTarget(actionMetadata.controllerConstructor.prototype, actionMetadata.controllerMethod.name, parameterIndex)
            const modelBinding = new DefaultModelBinding(target);
            actionMetadata.modelBindings.push(modelBinding);
        }
    }

    private addActionRoute(httpMethod: HttpMethod, path: string, controllerMetadata: ControllerInfo, actionMetadata: ActionInfo) {
        const route = new Route(
            httpMethod,
            path,
            controllerMetadata,
            actionMetadata,
        );
        this._routes.push(route);
    }
}

