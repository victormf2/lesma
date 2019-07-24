import { Constructor } from "../../_types";
import { IActionFilter } from "../action-filter";
import { ActionInfo } from "./action-info";

export class ControllerInfo {

    constructor(
        readonly controllerConstructor: Constructor,
        readonly route: string,
        readonly actions: ActionInfo[],
    ) {
    }

    filters: IActionFilter[] = [];
}