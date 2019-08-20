
import { ICaracolProvider } from "../../caracol/caracol-provider";
import { TypeInfo } from "../../metadata/type-info";
import { HttpException } from "../exceptions";
import { getParamRawValues } from "../model-binding";
import { RestContext } from "../rest-context";
import { IRouteBinder, Route } from "../routing";
import express = require("express");
import { ParserProvider } from "../parsers/parser-provider";
import { ParameterInfo } from "../../metadata";

export class DefaultRouteBinder implements IRouteBinder {

    constructor(private caracolProvider: ICaracolProvider) {

    }

    bindRoute(app: express.Application, route: Route) {
        app[route.httpMethod](route.path, async (req, res, next) => {
            try {
                const ctx = new RestContext(req, res, route);
                const caracol = this.caracolProvider.getCaracol(ctx);
                const parserProvider = caracol.get(ParserProvider);
                
                const { parameters, modelBindings } = ctx.route.action;
                const paramRawValues = await getParamRawValues(ctx, parameters, modelBindings, fillEmptyRawValues);
                const getParsedValues = route.action.parameters.map((parameter, index) => parse(parserProvider, paramRawValues[index], parameter.type))
                const parsedValues = await Promise.all(getParsedValues);
                
                const controllerInstance = caracol.get(route.controller.controllerConstructor);
                const result = await route.action.controllerMethod.apply(controllerInstance, parsedValues);
                handleResult(result, res);
            } catch (err) {
                handleError(err, res);
            }
        });
    }
}

async function parse(provider: ParserProvider, rawValue: any, typeInfo: TypeInfo): Promise<any> {
    const parser = provider.get(typeInfo);
    return parser.parse(rawValue, typeInfo);
}

function fillEmptyRawValues(parameter: ParameterInfo, ctx: RestContext) {
    const req = ctx.req
    if (typeof req.query[parameter.name] !== "undefined") {
        return req.query[parameter.name]
    }
    const parameters = ctx.route.action.parameters;
    if (parameter.index === parameters.length - 1 && ctx.req.method !== "GET") {
        return ctx.req.body
    }
}

function handleResult(result: any, res: express.Response) {
    if (typeof result === "undefined") {
        res.status(204).send("");
    } else if (typeof result === "string") {
        res.status(200).send(result);
    } else if (false) {
        // TODO handle status responses
    } else {
        res.status(200).json(result);
    }
}

function handleError(err: any, res: express.Response) {
    if (HttpException.isHttpException(err)) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    } else {
        res.status(500).json({
            success: false,
            message: "Error"
        });
    }
}