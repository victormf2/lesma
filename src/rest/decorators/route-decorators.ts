import "reflect-metadata";
import { ActionRouteInfo } from "../metadata";
import { RestMetadata } from "../metadata";
import { HttpMethod } from "../_types";
import { decorate } from "../../_helpers";

function routeDecorator(method: HttpMethod, path: string, isRoot: boolean): MethodDecorator {
    const decorator = decorate().method((controllerConstructor, methodName) =>  {
        const actionRouteInfo = new ActionRouteInfo(method, path, isRoot);
        RestMetadata.addActionMethod(controllerConstructor, methodName);
        RestMetadata.addActionRoute(controllerConstructor, methodName, actionRouteInfo);
    });
    return decorator.value();
}

export function Get(path: string = "", isRoot: boolean = false): MethodDecorator {
    return routeDecorator("get", path, isRoot);
}
export function Post(path: string = "", isRoot: boolean = false): MethodDecorator {
    return routeDecorator("post", path, isRoot);
}
export function Put(path: string = "", isRoot: boolean = false): MethodDecorator {
    return routeDecorator("put", path, isRoot);
}
export function Delete(path: string = "", isRoot: boolean = false): MethodDecorator {
    return routeDecorator("delete", path, isRoot);
}