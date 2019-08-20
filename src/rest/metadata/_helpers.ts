import { Constructor } from "../../_types";
import { ActionRouteInfo, ModelBindingInfo } from "../metadata";
import { Metadata } from "../../metadata";

const ControllersMetadataKey = "lesma:controllers";
export function getControllers(): Constructor[] {
    return Metadata.getArrayMetadata(ControllersMetadataKey, Metadata.MetadataBase);
}
export function addController(controllerConstructor: Constructor) {
    const controllers = getControllers();
    if (!controllers.includes(controllerConstructor)) {
        controllers.push(controllerConstructor);
    }
}
const ControllerRouteMetadataKey = "lesma:controller-route";
export function setControllerRoutePath(controllerConstructor: Constructor, routePath: string) {
    Reflect.defineMetadata(ControllerRouteMetadataKey, routePath, controllerConstructor);
}
export function getControllerRoutePath(controllerConstructor: Constructor): string {
    return Reflect.getMetadata(ControllerRouteMetadataKey, controllerConstructor);
}

const ControllerActionMethodsMetadataKey = "lesma:controller-action-methods";
export function getActionMethods(controllerConstructor: Constructor): string[] {
    return Metadata.getArrayMetadata(ControllerActionMethodsMetadataKey, controllerConstructor);
}
export function addActionMethod(controllerConstructor: Constructor, methodName: string) {
    const controllerMethods = getActionMethods(controllerConstructor);
    if (!controllerMethods.includes(methodName)) {
        controllerMethods.push(methodName);
    }
}
const ActionRouteMetadataKey = "lesma:action-routes";
export function getActionRoutes(controllerConstructor: Constructor, methodName: string): ActionRouteInfo[] {
    return Metadata.getArrayMetadata(ActionRouteMetadataKey, controllerConstructor, methodName);
}
export function addActionRoute(controllerConstructor: Constructor, methodName: string, route: ActionRouteInfo) {
    const routes = getActionRoutes(controllerConstructor, methodName);
    routes.push(route);
}

const ModelBindingMetadataKey = "lesma:model-binding";
export function getModelBindings(constructor: Constructor, propertyKey?: string): ModelBindingInfo[] {
    return Metadata.getArrayMetadata(ModelBindingMetadataKey, constructor, propertyKey);
}
export function addModelBinding(modelBinding: ModelBindingInfo, constructor: Constructor, propertyKey?: string) {
    const modelBindings = getModelBindings(constructor, propertyKey);
    modelBindings.push(modelBinding);
}