import * as path from "path";
import { Route } from "../routing";
import { ControllerInfo, ActionInfo } from "../metadata";
import { HttpMethod } from "../_types";

export class RouteCollection {
    private _routes: Route[] = [];
    constructor(controllers: ControllerInfo[]) {
        controllers.forEach(controller => {
            this.addControllerRoutes(controller);
        }); 
    }

    get routes(): Route[] {
        return this._routes;
    }

    private addControllerRoutes(controller: ControllerInfo) {
        controller.actions.forEach(action => {
            
            for (let route of action.routes) {
                const fullPath = route.isRoot ?
                    path.posix.join("/", route.path) : 
                    path.posix.join("/", controller.routePath, route.path);
                this.addActionRoute(route.httpMethod, fullPath, controller, action);
            }
        });
    }

    private addActionRoute(httpMethod: HttpMethod, path: string, controller: ControllerInfo, action: ActionInfo) {

        // TODO
        // Para os parameterIndexes sem ModelBinding verificar se o nome bate com um parâmetro de rota e adicionar um PathModelBinding

        const route = new Route(
            httpMethod,
            path,
            controller,
            action,
        );
        this._routes.push(route);
    }
}

