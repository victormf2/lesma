import * as express from "express";
import * as bodyParser from "body-parser";
import { MetadataProvider } from "./metadata";
import { RouteParser } from "./route-parser";

const defaultLesmaOptions: LesmaOptions = {
    port: 3000
};

function validateOptions(options: LesmaOptions) {
    if (!options) return;
    const errorMessages: string[] = [];

    if (typeof options.port !== "number") {
        errorMessages.push(`Port must be a number`);
    }
    if (errorMessages.length) {
        throw new Error("Invalid options: " + errorMessages.join(", "));
    }
}

export class Lesma {

    private _app: express.Application;
    private _options: LesmaOptions;
    constructor(
        lesmaOptions?: LesmaOptions
    ) {
        validateOptions(lesmaOptions);
        this._app = express();
        this._app.use(bodyParser.json());
        this._options = Object.assign({}, defaultLesmaOptions, lesmaOptions);
        const metadata = MetadataProvider.getMetadata();
        for (let routeBinding of metadata.routeBindings) {
            RouteParser.parseRoute(this._app, routeBinding);
        }
    }

    start() {
        this._app.listen(this._options.port);
        console.log(`Application running on http://localhost:${this._options.port}/`)
    }
}

export interface LesmaOptions {
    port?: number
}