import "reflect-metadata";
import { ActionRouteInfo } from "../metadata";
import { RestMetadata } from "../metadata";
import { HttpMethod } from "../_types";

function routeDecorator(method: HttpMethod, path: string, isRoot: boolean) {
    const decorator: MethodDecorator = function (controllerPrototype: Object, methodName: string) {
        const actionRouteInfo = new ActionRouteInfo(method, path, isRoot);
        RestMetadata.addActionMethod(controllerPrototype.constructor, methodName);
        RestMetadata.addActionRoute(controllerPrototype.constructor, methodName, actionRouteInfo);
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