import "reflect-metadata";
import { addActionRoute, addControllerActionMethod } from "../metadata/metadata-helpers";
import { RouteMetadata } from "../metadata/route-metadata";
import { HttpMethod } from "../types";

function routeDecorator(method: HttpMethod, path: string, isRoot: boolean) {
    const decorator: MethodDecorator = function (controllerPrototype: Object, methodName: string) {
        const routeMetadata = new RouteMetadata(method, path, isRoot);
        addControllerActionMethod(controllerPrototype.constructor as any, methodName);
        addActionRoute(controllerPrototype, methodName, routeMetadata);
    };
    return decorator;
}

export function Get(path: string = "", isRoot: boolean = false) {
    return routeDecorator("get", path, isRoot);
}
export function Post(path: string = "", isRoot: boolean = false) {
    return routeDecorator("post", path, isRoot);
}
export function Put(path: string = "", isRoot: boolean = false) {
    return routeDecorator("put", path, isRoot);
}
export function Delete(path: string = "", isRoot: boolean = false) {
    return routeDecorator("delete", path, isRoot);
}