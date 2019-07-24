import express = require("express");
import { Route } from "./routing/route";

export class RestContext {
    constructor(
        readonly req: express.Request,
        readonly res: express.Response,
        readonly route: Route
    ) {

    }
}