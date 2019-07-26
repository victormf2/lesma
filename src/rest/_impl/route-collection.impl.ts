import * as path from "path";
import { Route } from "../routing";
import { ControllerInfo, ActionInfo } from "../metadata";
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
            
            for (let route of actionMetadata.routes) {
                const fullPath = route.isRoot ?
                    path.posix.join("/", route.path) : 
                    path.posix.join("/", basePath, route.path);
                this.addActionRoute(route.httpMethod, fullPath, controllerMetadata, actionMetadata);
            }
        });
    }

    private addActionRoute(httpMethod: HttpMethod, path: string, controllerMetadata: ControllerInfo, actionMetadata: ActionInfo) {

        // TODO
        // Para os parameterIndexes sem ModelBinding verificar se o nome bate com um parâmetro de rota e adicionar um PathModelBinding

        const route = new Route(
            httpMethod,
            path,
            controllerMetadata,
            actionMetadata,
        );
        this._routes.push(route);
    }
}

