import express = require("express");
import { BadRequestExecption, HttpException } from "./exceptions/http-exceptions";
import { ValidationError } from "./validation-error";
import { RouteBinding } from "./metadata/routing-metadata";
import { ModelBindingMetadata, QueryModelBinding, PathModelBinding, HeaderModelBinding, DefaultModelBinding } from "./metadata/model-binding";
import { HttpContext } from "./request-handling/http-context";
import { ParameterInfo } from "./metadata/parameter-metadata";

export interface IRouteParser {
    parseRoute(app: express.Application, routeBinding: RouteBinding): void;
}

class DefaultRouteParser implements IRouteParser {
    parseRoute(app: express.Application, routeBinding: RouteBinding) {

        app[routeBinding.httpMethod](routeBinding.path, async (req, res, next) => {
            try {
                const ctx = new HttpContext(req, res);
                const paramRawValues = getRawValues(req, routeBinding);
    
                const parsedValues = new Array<any>(routeBinding.parameters.length);
                const validationErrors: ValidationError[] = [];
                for (let [modelBinding, rawValue] of paramRawValues) {
                    const paramIndex = modelBinding.target.parameterIndex;
                    const parameter = routeBinding.parameters[paramIndex];
                    const parsedValue = parseAndValidate(rawValue, parameter, parsedValues[paramIndex], modelBinding.target.targetPath);
                    if (parsedValue instanceof ValidationError) {
                        validationErrors.push(parsedValue);
                        continue;
                    }
                    parsedValues[paramIndex] = parsedValue;
                }
                if (validationErrors.length) {
                    throw new BadRequestExecption(`Invalid request: ` + validationErrors.map(v => v.message).join(", "));
                }
                const controllerInstance = new routeBinding.controllerConstructor(ctx);
                const result = await routeBinding.controllerMethod.apply(controllerInstance, parsedValues);
                handleResult(result, res);
            } catch (err) {
                handleError(err, res);
            }
        });
    }
}
export const RouteParser = new DefaultRouteParser();

function getRawValues(req: express.Request, routeBinding: RouteBinding): [ModelBindingMetadata, any][] {

    const rawValues: [ModelBindingMetadata, any][] = [];
    const errorMessages: string[] = [];
    for (let modelBinding of routeBinding.modelBindings) {
        const targetParameter = routeBinding.parameters[modelBinding.target.parameterIndex];
        if (modelBinding instanceof QueryModelBinding) {
            const queryValue = req.query[modelBinding.name];
            if (typeof queryValue === "undefined" && !targetParameter.hasDefaultValue) {
                errorMessages.push(`Query parameter ${modelBinding.name} is required`);
                continue;
            }
            rawValues.push([modelBinding, queryValue]);
        } else if (modelBinding instanceof PathModelBinding) {
            const pathValue = req.params[modelBinding.name];
            if (typeof pathValue === "undefined" && !targetParameter.hasDefaultValue) {
                errorMessages.push(`Path value ${modelBinding.name} is required`);
                continue;
            }
            rawValues.push([modelBinding, pathValue]);
        } else if (modelBinding instanceof HeaderModelBinding) {
            const headerValue = req.header(modelBinding.name);
            if (typeof headerValue === "undefined" && !targetParameter.hasDefaultValue) {
                errorMessages.push(`Header ${modelBinding.name} is required`);
                continue;
            }
            rawValues.push([modelBinding, headerValue]);
        } else if (modelBinding instanceof DefaultModelBinding) {
            if (typeof req.params[targetParameter.name] !== "undefined") {
                rawValues.push([modelBinding, req.params[targetParameter.name]]);
            } else if (typeof req.query[targetParameter.name] !== "undefined") {
                rawValues.push([modelBinding, req.query[targetParameter.name]]);
            } else if (req.method !== "GET" && modelBinding.target.parameterIndex === routeBinding.parameters.length - 1) {
                rawValues.push([modelBinding, req.body])
            } else {
                if (!targetParameter.hasDefaultValue) {
                    errorMessages.push(`Could not set required parameter ${targetParameter.name}`);
                    continue;
                }
            }
        }
    }

    if (errorMessages.length) {
        throw new BadRequestExecption("Invalid Request: " + errorMessages.join(", "));
    }

    return rawValues;
}

function parseAndValidate(rawValue: any, parameter: ParameterInfo, currentParsedValue: any, targetPath: string): any {

    if (parameter.type == String) {
        return rawValue;
    } else if (parameter.type == Number) {
        const num = Number(rawValue);
        if (isNaN(num)) {
            return new ValidationError(`The value for ${parameter.name} is not a valid number: ${rawValue}`);
        }
        return num;
    } else if (parameter.type == Date) {
        const date = new Date(rawValue);
        if (isNaN(date.getTime())) {
            return new ValidationError(`The value for ${parameter.name} is not a valida date: ${rawValue}`);
        }
        return date;
    } else if (parameter.type == Boolean) {
        return rawValue && `${rawValue}`.toLowerCase() !== "false";
    } else {
        return rawValue;
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