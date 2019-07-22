import { HttpMethod } from "./types";
export class ActionRoute {
    constructor(
        readonly httpMethod: HttpMethod,
        readonly path: string,
        readonly controllerPrototype: any,
        readonly methodDescriptor: TypedPropertyDescriptor<any>
    ) {

    }
}

export class ControllerRoute {
    constructor(
        readonly path: string,
        readonly controllerConstructor: any,
    ) {

    }
}

interface RoutingMetadata {
    [key: string]: {
        controllerRoute: ControllerRoute,
        actionRoutes: Iterable<ActionRoute>
    }
}

class RoutingMetadataBuilder {
    private _controllerRoutes: {[key: string]: ControllerRoute} = {};
    private _actionRoutes: ActionRoute[] = [];
    addActionRoute(httpMethod: HttpMethod, path: string, controllerPrototype: any, methodDescriptor: TypedPropertyDescriptor<any>) {
        this._actionRoutes.push(new ActionRoute(httpMethod, path, controllerPrototype, methodDescriptor));
    }

    addControllerRoute(path: string, controllerConstructor: any) {
        const controllerRoute = new ControllerRoute(path, controllerConstructor);
        this._controllerRoutes[controllerConstructor.name] = controllerRoute;
    }

    getMetadata(): RoutingMetadata {
        const routingMetadata: RoutingMetadata = {};
        for (let controllerName in this._controllerRoutes) {
            routingMetadata[controllerName] = {
                controllerRoute: this._controllerRoutes[controllerName],
                actionRoutes: this._actionRoutes.filter(actionRoute => 
                    actionRoute.controllerPrototype == this._controllerRoutes[controllerName].controllerConstructor.prototype
                )
            }
        }
        return routingMetadata;
    }
}

export const routingMetadata = new RoutingMetadataBuilder();
