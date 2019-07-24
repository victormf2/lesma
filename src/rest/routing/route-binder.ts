import * as express from "express";
import { Route } from "./route";

export interface IRouteBinder {
    bindRoute(app: express.Application, route: Route): void;
}