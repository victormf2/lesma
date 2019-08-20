import { Constructor } from "../../_types";
import { ActionInfo, ControllerInfo, RestMetadata } from "../metadata";
import { IRouteProvider, IRouteCollection } from "../routing";
import { RouteCollection } from "./route-collection.impl";

export class DefaultRouteProvider implements IRouteProvider {

    getRouteCollection(): IRouteCollection {
        const controllerContructors = RestMetadata.getControllers();
        const controllerMetadatas = controllerContructors.map(controllerConstructor => this.getControllerMetadata(controllerConstructor));
        return new RouteCollection(controllerMetadatas);
    }

    private getActionMetadata(controllerConstructor: Constructor, controllerMethodName: string) {
        const routes = RestMetadata.getActionRoutes(controllerConstructor, controllerMethodName);
        const modelBindings = RestMetadata.getModelBindings(controllerConstructor, controllerMethodName);
        const actionMetadata = new ActionInfo(controllerConstructor, controllerMethodName, routes, modelBindings);

        // TODO
        // Parâmetros sem default value recebem o Required validator

        return actionMetadata;
    }

    private getControllerMetadata(controllerConstructor: Constructor) {
        const baseRoute = RestMetadata.getControllerRoutePath(controllerConstructor);
        const methodNames = RestMetadata.getActionMethods(controllerConstructor);
        const actionMetadatas = methodNames.map(methodName => this.getActionMetadata(controllerConstructor, methodName));
        const controllerMetadata = new ControllerInfo(controllerConstructor, baseRoute, actionMetadatas);
        return controllerMetadata;
    }
}