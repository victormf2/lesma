import { IActionFilter } from "../action-filter";
import { ActionInfo } from "./action-info";
import { TypeInfo } from "../../reflection";
import { ControllerDecorator, RouteDecorator } from "../decorators";
import { toArray } from "../../_helpers";

export class ControllerInfo {

    constructor(
        readonly typeInfo: TypeInfo,
        readonly controllerDecorator: ControllerDecorator,
    ) {
    }

    private _actions: ActionInfo[]
    get actions(): ActionInfo[] {
        if (!this._actions) {
            this._actions = toArray(this.buildActions())
        }
        return this._actions
    }
    private * buildActions(): IterableIterator<ActionInfo> {
        for (let method of this.typeInfo.methods) {
            const routeDecorators = method.getDecorators<RouteDecorator>(RouteDecorator)
            if (routeDecorators.length)
            yield new ActionInfo(method, routeDecorators)
        }
    }

    get routePath(): string {
        return this.controllerDecorator.routePath
    }

    filters: IActionFilter[] = [];
}