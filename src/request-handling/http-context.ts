import express = require("express");

export class HttpContext {
    constructor(
        readonly req: express.Request,
        readonly res: express.Response,
    ) {

    }
}