import "reflect-metadata";
import { Constructor } from "../types";
import { ModelBindingMetadata } from "./model-binding";
import { RouteMetadata } from "./route-metadata";
import { DependencyMetadata, Scope } from "./dependency-metadata";
import { DependencyFactory, ICaracol } from "../caracol";

const base = new Object();
const ControllersMetadataKey = "lesma:controllers";
export function getControllers(): Constructor[] {
    return getArrrayMetadata(ControllersMetadataKey, base);
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
export function getControllerActionMethods(controllerConstructor: Constructor): string[] {
    return getArrrayMetadata(ControllerActionMethodsMetadataKey, controllerConstructor);
}
export function addControllerActionMethod(controllerConstructor: Constructor, methodName: string) {
    const controllerMethods = getControllerActionMethods(controllerConstructor);
    if (!controllerMethods.includes(methodName)) {
        controllerMethods.push(methodName);
    }
}
const ActionRouteMetadataKey = "lesma:action-routes";
export function getActionRoutes(controllerPrototype: Object, methodName: string): RouteMetadata[] {
    return getArrrayMetadata(ActionRouteMetadataKey, controllerPrototype, methodName);
}
export function addActionRoute(controllerPrototype: Object, methodName: string, routeMetadata: RouteMetadata) {
    const routeMetadatas = getActionRoutes(controllerPrototype, methodName);
    routeMetadatas.push(routeMetadata);
}

const ModelBindingMetadataKey = "lesma:model-binding";
export function getModelBindings(controllerPrototype: Object, methodName: string): ModelBindingMetadata[] {
    return getArrrayMetadata(ModelBindingMetadataKey, controllerPrototype, methodName);
}
export function addModelBinding(controllerPrototype: Object, methodName: string, modelBinding: ModelBindingMetadata) {
    const modelBindings = getModelBindings(controllerPrototype, methodName);
    modelBindings.push(modelBinding);
}

const DependencyMetadataKey = "lesma:dependencies";
export function getDependencies<T>(): Map<any, DependencyMetadata<T>> {
    let metadata: Map<any, DependencyMetadata> = Reflect.getMetadata(DependencyMetadataKey, base);
    if (!metadata) {
        metadata = new Map();
        Reflect.defineMetadata(DependencyMetadataKey, metadata, base);
    }
    return metadata;
}
export function addDependency<T>(key: string, instance: T): void;    
export function addDependency<T>(key: string, scope: Scope, factory: DependencyFactory<T>): void;
export function addDependency<T>(type: Constructor<T>, scope?: Scope, factory?: DependencyFactory<T>): void;
export function addDependency<T>(key: string | Constructor<T>, dependencyMetadata: DependencyMetadata<T>): void;
export function addDependency<T>(key: string | Constructor<T>, p2?: T | Scope | DependencyMetadata<T>, factory?: DependencyFactory<T>) {
    if (p2 instanceof DependencyMetadata) {
        const dependencies = getDependencies();
        dependencies.set(key, p2);
        return;
    }
    if (typeof key === "string") {
        if (typeof factory !== "function") {
            const instance = p2;
            return addDependency(key, new DependencyMetadata(Scope.Singleton, () => instance));
        }
        const scope = p2 as Scope;
        return addDependency(key, scope, factory);
    }
    if (typeof key === "function") {
        const prototype = key.prototype;
        const scope = p2 as Scope || Scope.Transient;
        return addDependency(prototype, new DependencyMetadata(scope, factory || getDefaultFactory(key)));
    }
}

function getDefaultFactory<T>(constructor: Constructor<T>): DependencyFactory<T> {
    const constructorTypes: Constructor[] = Reflect.getMetadata("design:paramtypes", constructor)
    if (!constructorTypes) {
        throw new Error(`Default dependency injection require a decorator on class ${constructor.name}. You may use @Injectable to set scope.`);
    }
    return (caracol: ICaracol) => {
        const parameters = constructorTypes.map(type => caracol.get(type));
        return new constructor(...parameters);
    }
}


function getArrrayMetadata<T>(metadataKey: string, target: Object, propertyKey?: string): T[] {
    let metadata: T[] = Reflect.getMetadata(metadataKey, target, propertyKey);
    if (!metadata) {
        metadata = [];
        Reflect.defineMetadata(metadataKey, metadata, target, propertyKey);
    }
    return metadata;
}