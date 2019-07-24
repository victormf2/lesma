import express = require("express");
import bodyParser = require("body-parser");;
import { ILesmaPlugin } from "../lesma";
import { ICaracolProvider } from "../caracol";
import { IRouteBinder, IRouteProvider } from "./routing";
import { DefaultRouteBinder, DefaultRouteProvider } from "./_impl";

export interface IRestOptions {
    port?: number,
    getRouteBinder?: (caracolProvider: ICaracolProvider) => IRouteBinder,
    getRouteProvider?: (caracolProvider: ICaracolProvider) => IRouteProvider
}

const defaultOptions: IRestOptions = {
    port: 3000,
    getRouteBinder: caracolProvider => new DefaultRouteBinder(caracolProvider),
    getRouteProvider: () => new DefaultRouteProvider(),
}

export class RestPlugin implements ILesmaPlugin {

    private app: express.Application;

    constructor(private options?: IRestOptions) {
        validateOptions(options);
        this.options = Object.assign({}, defaultOptions, options);
    }

    setup(caracolProvider: ICaracolProvider): void {
        this.app = express();
        this.app.use(bodyParser.json());

        const routeBinder = this.options.getRouteBinder(caracolProvider);
        const routeProvider = this.options.getRouteProvider(caracolProvider);
        const routeCollection = routeProvider.getRouteCollection();
        for (let route of routeCollection.routes) {
            routeBinder.bindRoute(this.app, route);
        }
    }

    start(): void {
        this.app.listen(this.options.port);
        console.log(`Application running on http://localhost:${this.options.port}/`)
    }
}


function validateOptions(options: IRestOptions) {
    if (!options) return;
    const errorMessages: string[] = [];

    if (typeof options.port !== "number") {
        errorMessages.push(`Port must be a number`);
    }
    if (errorMessages.length) {
        throw new Error("Invalid options: " + errorMessages.join(", "));
    }
}