import { ControllerMetadata } from "./controller-metadata";
import { ActionMetadata } from "./action-metadata";
import { ModelBindingMetadata } from "./model-binding";
import { RouteMetadata } from "./route-metadata";
import { RoutingMetadata } from "./routing-metadata";

export interface IMetadataProvider {
    addActionRoute(route: RouteMetadata, controllerPrototype: Object, controllerMethodName: string): void;
    addModelBinding(modelBinding: ModelBindingMetadata, controllerPrototype: Object, controllerMethodName: string): void;
    getMetadata(): RoutingMetadata;
}

class DefaultMetadataProvider implements IMetadataProvider {

    private _controllers = new Map<Object, ControllerMetadata>();

    addBaseRoute(routePath: string, controllerPrototype: Object) {
        const controllerMetadata = this.getControllerMetadata(controllerPrototype);
        controllerMetadata.routes.push(routePath);
    }

    addActionRoute(routeMetadata: RouteMetadata, controllerPrototype: Object, controllerMethodName: string) {
        const actionMetadata = this.getActionMetadata(controllerPrototype, controllerMethodName);
        actionMetadata.addRoute(routeMetadata);
    }

    addModelBinding(modelBinding: ModelBindingMetadata, controllerPrototype: Object, controllerMethodName: string) {
        const actionMetadata = this.getActionMetadata(controllerPrototype, controllerMethodName);
        actionMetadata.addModelBinding(modelBinding);
    }

    getMetadata(): RoutingMetadata {
        return new RoutingMetadata(this._controllers);
    }

    private getActionMetadata(controllerPrototype: Object, controllerMethodName: string) {
        const controllerMetadata = this.getControllerMetadata(controllerPrototype);
        if (!controllerMetadata.actions.has(controllerMethodName)) {
            const newMetadata = new ActionMetadata(controllerPrototype, controllerMethodName);
            controllerMetadata.actions.set(controllerMethodName, newMetadata);
        }
        const actionMetadata = controllerMetadata.actions.get(controllerMethodName);
        return actionMetadata;
    }

    private getControllerMetadata(controllerPrototype: Object) {
        if (!this._controllers.has(controllerPrototype)) {
            const newMetadata = new ControllerMetadata(controllerPrototype.constructor as any);
            this._controllers.set(controllerPrototype, newMetadata);
        }
        const controllerMetadata = this._controllers.get(controllerPrototype);
        return controllerMetadata;
    }
}

export const MetadataProvider = new DefaultMetadataProvider();