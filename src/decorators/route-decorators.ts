import "reflect-metadata";
import { HttpMethod } from "../types";
import { routingMetadata } from "../lesma-routing-metadata";

function routeDecorator(method: HttpMethod, route: string) {
    const decorator: MethodDecorator = function (controllerPrototype: Object, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        routingMetadata.addActionRoute(method, route, controllerPrototype, descriptor);
    };
    return decorator;
}

export function Get(route: string = "") {
    return routeDecorator("get", route);
}
export function Post(route: string = "") {
    return routeDecorator("post", route);
}
export function Put(route: string = "") {
    return routeDecorator("put", route);
}
export function Delete(route: string = "") {
    return routeDecorator("delete", route);
}