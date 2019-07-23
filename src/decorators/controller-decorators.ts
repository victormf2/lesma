import "reflect-metadata";
import { Constructor } from "../types";
import { setControllerRoutePath, addController } from "../metadata/metadata-helpers";

export function Controller(controllerRoute?: string) {
    const decorator = (controllerConstructor: Constructor) => {
        const routePath = controllerRoute || getControllerBaseRoute(controllerConstructor.name);
        setControllerRoutePath(controllerConstructor, routePath);
        addController(controllerConstructor);
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