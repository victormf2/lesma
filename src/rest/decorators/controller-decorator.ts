import "reflect-metadata";
import { RestMetadata } from "../metadata";
import { CaracolMetadata, Scope } from "../../caracol";

export function Controller(controllerRoute?: string) {
    const decorator: ClassDecorator = (controllerConstructor: Function) => {
        const routePath = controllerRoute || getControllerBaseRoute(controllerConstructor.name);
        RestMetadata.setControllerRoutePath(controllerConstructor, routePath);
        RestMetadata.addController(controllerConstructor);
        CaracolMetadata.addDependency(controllerConstructor, Scope.Context);
    }
    return decorator;
}

function getControllerBaseRoute(controllerClass: string): string {
    const suffixIndex = controllerClass.lastIndexOf("Controller");
    if (suffixIndex === -1) {
        return controllerClass;
    }
    return toDash(controllerClass.substring(0, suffixIndex));
}

function toDash(str: string): string {
    return str.charAt(0).toLowerCase() +
        str.substring(1).replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
}