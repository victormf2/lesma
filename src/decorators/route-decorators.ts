import "reflect-metadata";
import { HttpMethod } from "../types";
import { MetadataProvider } from "../metadata";
import { RouteMetadata } from "../metadata/route-metadata";

function routeDecorator(method: HttpMethod, route: string, isRoot: boolean) {
    const decorator: MethodDecorator = function (controllerPrototype: Object, methodName: string) {
        const routeMetadata = new RouteMetadata(method, route, isRoot);
        MetadataProvider.addActionRoute(routeMetadata, controllerPrototype, methodName);
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