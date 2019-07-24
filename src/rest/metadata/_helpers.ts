import { Constructor } from "../../_types";
import { ActionRouteInfo, ModelBindingInfo } from "../metadata";
import { Metadata } from "../../metadata";

const ControllersMetadataKey = "lesma:controllers";
export function getControllers(): Constructor[] {
    return Metadata.getArrrayMetadata(ControllersMetadataKey, Metadata.MetadataBase);
}
export function addController(controllerConstructor: Constructor | Function) {
    const controllers = getControllers();
    if (!controllers.includes(controllerConstructor as Constructor)) {
        controllers.push(controllerConstructor as Constructor);
    }
}
const ControllerRouteMetadataKey = "lesma:controller-route";
export function setControllerRoutePath(controllerConstructor: Constructor | Function, routePath: string) {
    Reflect.defineMetadata(ControllerRouteMetadataKey, routePath, controllerConstructor);
}
export function getControllerRoutePath(controllerConstructor: Constructor): string {
    return Reflect.getMetadata(ControllerRouteMetadataKey, controllerConstructor);
}

const ControllerActionMethodsMetadataKey = "lesma:controller-action-methods";
export function getActionMethods(controllerConstructor: Constructor): string[] {
    return Metadata.getArrrayMetadata(ControllerActionMethodsMetadataKey, controllerConstructor);
}
export function addActionMethod(controllerConstructor: Constructor | Function, methodName: string) {
    const controllerMethods = getActionMethods(controllerConstructor as Constructor);
    if (!controllerMethods.includes(methodName)) {
        controllerMethods.push(methodName);
    }
}
const ActionRouteMetadataKey = "lesma:action-routes";
export function getActionRoutes(controllerConstructor: Constructor, methodName: string): ActionRouteInfo[] {
    return Metadata.getArrrayMetadata(ActionRouteMetadataKey, controllerConstructor, methodName);
}
export function addActionRoute(controllerConstructor: Constructor | Function, methodName: string, route: ActionRouteInfo) {
    const routes = getActionRoutes(controllerConstructor as Constructor, methodName);
    routes.push(route);
}

const ModelBindingMetadataKey = "lesma:model-binding";
export function getModelBindings(controllerConstructor: Constructor, methodName: string): ModelBindingInfo[] {
    return Metadata.getArrrayMetadata(ModelBindingMetadataKey, controllerConstructor, methodName);
}
export function addModelBinding(controllerConstructor: Constructor | Function, methodName: string, modelBinding: ModelBindingInfo) {
    const modelBindings = getModelBindings(controllerConstructor as Constructor, methodName);
    modelBindings.push(modelBinding);
}