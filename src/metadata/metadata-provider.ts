import { Constructor } from "../types";
import { ActionMetadata } from "./action-metadata";
import { ControllerMetadata } from "./controller-metadata";
import { getActionRoutes, getControllerActionMethods, getControllerRoutePath, getControllers as getControllerContructors, getModelBindings } from "./metadata-helpers";
import { RoutingMetadata } from "./routing-metadata";

export interface IMetadataProvider {
    getRoutingMetadata(): RoutingMetadata;
}

class DefaultMetadataProvider implements IMetadataProvider {

    getRoutingMetadata(): RoutingMetadata {
        const controllerContructors = getControllerContructors();
        const controllerMetadatas = controllerContructors.map(controllerConstructor => this.getControllerMetadata(controllerConstructor));
        return new RoutingMetadata(controllerMetadatas);
    }

    private getActionMetadata(controllerPrototype: Object, controllerMethodName: string) {
        const routes = getActionRoutes(controllerPrototype, controllerMethodName);
        const modelBindings = getModelBindings(controllerPrototype, controllerMethodName);
        const actionMetadata = new ActionMetadata(controllerPrototype, controllerMethodName, routes, modelBindings);
        return actionMetadata;
    }

    private getControllerMetadata(controllerConstructor: Constructor) {
        const baseRoute = getControllerRoutePath(controllerConstructor);
        const methodNames = getControllerActionMethods(controllerConstructor);
        const actionMetadatas = methodNames.map(methodName => this.getActionMetadata(controllerConstructor.prototype, methodName));
        const controllerMetadata = new ControllerMetadata(controllerConstructor, baseRoute, actionMetadatas);
        return controllerMetadata;
    }
}

export const MetadataProvider = new DefaultMetadataProvider();