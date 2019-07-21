import "reflect-metadata";
import { routingMetadata } from "../lesma-routing-metadata";

export function Controller(controllerRoute?: string) {
    const decorator: ClassDecorator = (controllerConstructor: any) => {
        routingMetadata.addControllerRoute(
            controllerRoute || getControllerBaseRoute(controllerConstructor.name),
            controllerConstructor
        )
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