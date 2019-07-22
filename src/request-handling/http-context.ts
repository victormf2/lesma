import express = require("express");
import { RouteBinding } from "../metadata/routing-metadata";

export class HttpContext {
    constructor(
        readonly req: express.Request,
        readonly res: express.Response,
        readonly routeBinding: RouteBinding
    ) {

    }
}