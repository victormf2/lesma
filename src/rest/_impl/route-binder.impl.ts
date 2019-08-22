
import { ICaracolProvider } from "../../caracol/caracol-provider";
import { HttpException } from "../exceptions";
import { ParserProvider } from "../parsers/parser-provider";
import { RestContext } from "../rest-context";
import { IRouteBinder, Route } from "../routing";
import express = require("express");

export class DefaultRouteBinder implements IRouteBinder {

    constructor(private caracolProvider: ICaracolProvider) {

    }

    bindRoute(app: express.Application, route: Route) {
        app[route.httpMethod](route.path, async (req, res, next) => {
            try {
                const ctx = new RestContext(req, res, route)
                const caracol = this.caracolProvider.getCaracol(ctx)
                const parserProvider = caracol.get(ParserProvider)
                
                const parameterBindings = route.action.getParameterBindings(parserProvider)
                const getParsedValues = parameterBindings.map(async binding => {
                    const rawValue =  await binding.valueProvider.getRawValue(ctx)
                    const parsedValue = await binding.parser.parse(rawValue, binding.parameter.type)
                    return parsedValue
                })
                const parsedValues = await Promise.all(getParsedValues)
                // TODO handle parse errors
                
                const controllerInstance = caracol.get(route.controller.typeInfo.type)
                const result = await route.action.methodInfo.method.apply(controllerInstance, parsedValues)
                handleResult(result, res)
                next()
            } catch (err) {
                handleError(err, res)
                next(err)
            }
        })
    }
}


function handleResult(result: any, res: express.Response) {
    if (typeof result === "undefined") {
        res.status(204).send("")
    } else if (typeof result === "string") {
        res.status(200).send(result)
    } else if (false) {
        // TODO handle status responses
    } else {
        res.status(200).json(result)
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
        })
    }
}