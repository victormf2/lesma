import { HttpMethod } from "../types";

export class RouteMetadata {
    constructor(
        readonly httpMethod: HttpMethod,
        readonly path: string,
        readonly isRoot = false
    ) {}
}