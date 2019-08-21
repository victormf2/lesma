import { Type } from "../../_types";
import { ActionRouteInfo } from "../metadata";

const ControllersMetadataKey = "lesma:controllers";
export function getControllers(): Type[] {
    return Metadata.getArrayMetadata(ControllersMetadataKey, Metadata.MetadataBase);
}
export function addController(controllerConstructor: Type) {
    const controllers = getControllers();
    if (!controllers.includes(controllerConstructor)) {
        controllers.push(controllerConstructor);
    }
}
const ControllerRouteMetadataKey = "lesma:controller-route";
export function setControllerRoutePath(controllerConstructor: Type, routePath: string) {
    Reflect.defineMetadata(ControllerRouteMetadataKey, routePath, controllerConstructor);
}
export function getControllerRoutePath(controllerConstructor: Type): string {
    return Reflect.getMetadata(ControllerRouteMetadataKey, controllerConstructor);
}

const ControllerActionMethodsMetadataKey = "lesma:controller-action-methods";
export function getActionMethods(controllerConstructor: Type): string[] {
    return Metadata.getArrayMetadata(ControllerActionMethodsMetadataKey, controllerConstructor);
}
export function addActionMethod(controllerConstructor: Type, methodName: string) {
    const controllerMethods = getActionMethods(controllerConstructor);
    if (!controllerMethods.includes(methodName)) {
        controllerMethods.push(methodName);
    }
}
const ActionRouteMetadataKey = "lesma:action-routes";
export function getActionRoutes(controllerConstructor: Type, methodName: string): ActionRouteInfo[] {
    return Metadata.getArrayMetadata(ActionRouteMetadataKey, controllerConstructor, methodName);
}
export function addActionRoute(controllerConstructor: Type, methodName: string, route: ActionRouteInfo) {
    const routes = getActionRoutes(controllerConstructor, methodName);
    routes.push(route);
}

const ModelBindingMetadataKey = "lesma:model-binding";
export function getModelBindings(constructor: Type, propertyKey?: string): ModelBindingInfo[] {
    return Metadata.getArrayMetadata(ModelBindingMetadataKey, constructor, propertyKey);
}
export function addModelBinding(modelBinding: ModelBindingInfo, constructor: Type, propertyKey?: string) {
    const modelBindings = getModelBindings(constructor, propertyKey);
    modelBindings.push(modelBinding);
}