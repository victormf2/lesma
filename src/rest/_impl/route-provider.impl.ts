import { Constructor } from "../../_types";
import { ActionInfo, ControllerInfo, RestMetadata } from "../metadata";
import { IRouteProvider, IRouteCollection } from "../routing";
import { RouteCollection } from "./route-collection.impl";

export class DefaultRouteProvider implements IRouteProvider {

    getRouteCollection(): IRouteCollection {
        const controllerContructors = RestMetadata.getControllerConstructors();
        const controllerMetadatas = controllerContructors.map(controllerConstructor => this.getControllerMetadata(controllerConstructor));
        return new RouteCollection(controllerMetadatas);
    }

    private getActionMetadata(controllerPrototype: Object, controllerMethodName: string) {
        const routes = RestMetadata.getActionRoutes(controllerPrototype, controllerMethodName);
        const modelBindings = RestMetadata.getModelBindings(controllerPrototype, controllerMethodName);
        const actionMetadata = new ActionInfo(controllerPrototype, controllerMethodName, routes, modelBindings);
        return actionMetadata;
    }

    private getControllerMetadata(controllerConstructor: Constructor) {
        const baseRoute = RestMetadata.getControllerRoutePath(controllerConstructor);
        const methodNames = RestMetadata.getControllerActionMethods(controllerConstructor);
        const actionMetadatas = methodNames.map(methodName => this.getActionMetadata(controllerConstructor.prototype, methodName));
        const controllerMetadata = new ControllerInfo(controllerConstructor, baseRoute, actionMetadatas);
        return controllerMetadata;
    }
}