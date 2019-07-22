import { Constructor } from "../types";
import { IActionFilter } from "../request-handling/action-filter";
import { ActionMetadata } from "./action-metadata";

export class ControllerMetadata {

    constructor(
        readonly controllerConstructor: Constructor
    ) {
    }

    routes: string[] = [];
    filters: IActionFilter[] = [];
    actions = new Map<string, ActionMetadata>();
}