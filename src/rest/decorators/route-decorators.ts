import "reflect-metadata";
import { HttpMethod } from "../_types";
import { decorate } from "../../_helpers";
import { Decorator, ReflectionMetadata } from "../../reflection";

export class RouteDecorator extends Decorator {
    constructor(
        readonly httpMethod: HttpMethod,
        readonly path: string,
        readonly isRoot: boolean
    ) {
        super()
    }
}

function routeDecorator(method: HttpMethod, path: string, isRoot: boolean): MethodDecorator {
    const decorator = decorate().method((controllerConstructor, methodName) =>  {
        const routeDecorator = new RouteDecorator(method, path, isRoot)
        ReflectionMetadata.addMethodDecorator(controllerConstructor, methodName, routeDecorator)
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
