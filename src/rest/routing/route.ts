import { ControllerInfo, ActionInfo } from "../metadata";
import { HttpMethod } from "../_types";

export class Route {
    constructor(
        readonly httpMethod: HttpMethod,
        readonly path: string,
        readonly controller: ControllerInfo,
        readonly action: ActionInfo,
    ) {

    }
}