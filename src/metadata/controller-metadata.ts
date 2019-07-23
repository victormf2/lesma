import { Constructor } from "../types";
import { IActionFilter } from "../request-handling/action-filter";
import { ActionMetadata } from "./action-metadata";

export class ControllerMetadata {

    constructor(
        readonly controllerConstructor: Constructor,
        readonly route: string,
        readonly actions: ActionMetadata[],
    ) {
    }

    filters: IActionFilter[] = [];
}