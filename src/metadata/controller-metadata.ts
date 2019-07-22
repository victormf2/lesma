import { Constructor } from "../types";
import { IActionFilter } from "../naoseiainda/action-filter";
import { ActionMetadata } from "./action-metadata";

export class ControllerMetadata {

    constructor(
    ) {
    }

    controllerConstructor: Constructor;
    routes: string[];
    filters: IActionFilter[] = [];
    actions = new Map<string, ActionMetadata>();
    get name(): string {
        return this.controllerConstructor.name;
    }

    
}