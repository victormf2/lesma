import { HttpMethod } from "../_types";

export class ActionRouteInfo {
    constructor(
        readonly httpMethod: HttpMethod,
        readonly path: string,
        readonly isRoot = false
    ) {}
}