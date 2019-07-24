import { Constructor } from "../../_types";
import { ActionRouteInfo, ModelBindingInfo } from "../metadata";
import { Metadata } from "../../metadata";

const ControllersMetadataKey = "lesma:controllers";
export function getControllerConstructors(): Constructor[] {
    return Metadata.getArrrayMetadata(ControllersMetadataKey, Metadata.MetadataBase);
}
export function addController(controllerConstructor: Constructor) {
    const controllers = getControllerConstructors();
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
export function getControllerActionMethods(controllerConstructor: Constructor): string[] {
    return Metadata.getArrrayMetadata(ControllerActionMethodsMetadataKey, controllerConstructor);
}
export function addActionMethod(controllerConstructor: Constructor, methodName: string) {
    const controllerMethods = getControllerActionMethods(controllerConstructor);
    if (!controllerMethods.includes(methodName)) {
        controllerMethods.push(methodName);
    }
}
const ActionRouteMetadataKey = "lesma:action-routes";
export function getActionRoutes(controllerPrototype: Object, methodName: string): ActionRouteInfo[] {
    return Metadata.getArrrayMetadata(ActionRouteMetadataKey, controllerPrototype, methodName);
}
export function addActionRoute(controllerPrototype: Object, methodName: string, routeMetadata: ActionRouteInfo) {
    const routeMetadatas = getActionRoutes(controllerPrototype, methodName);
    routeMetadatas.push(routeMetadata);
}

const ModelBindingMetadataKey = "lesma:model-binding";
export function getModelBindings(controllerPrototype: Object, methodName: string): ModelBindingInfo[] {
    return Metadata.getArrrayMetadata(ModelBindingMetadataKey, controllerPrototype, methodName);
}
export function addModelBinding(controllerPrototype: Object, methodName: string, modelBinding: ModelBindingInfo) {
    const modelBindings = getModelBindings(controllerPrototype, methodName);
    modelBindings.push(modelBinding);
}