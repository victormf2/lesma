import * as express from "express";
import { BadRequestExecption, HttpException } from "./exceptions/http-exceptions";
import { ModelBindingMetadata } from "./metadata/model-binding";
import { ParameterInfo } from "./metadata/parameter-metadata";
import { RouteBinding } from "./metadata/routing-metadata";
import { HttpContext } from "./request-handling/http-context";
import { ValidationError } from "./validation-error";

export interface IRouteBinder {
    bindRoute(app: express.Application, routeBinding: RouteBinding): void;
}

class DefaultRouteBinder implements IRouteBinder {
    bindRoute(app: express.Application, routeBinding: RouteBinding) {
        app[routeBinding.httpMethod](routeBinding.path, async (req, res, next) => {
            try {
                const ctx = new HttpContext(req, res, routeBinding);
                const paramRawValues = getRawValues(ctx);
                const parsedValues = new Array<any>(routeBinding.action.parameters.length);
                const validationErrors: ValidationError[] = [];
                for (let [modelBinding, rawValue] of paramRawValues) {
                    const paramIndex = modelBinding.target.parameterIndex;
                    const parameter = routeBinding.action.parameters[paramIndex];
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
                const controllerInstance = new routeBinding.controller.controllerConstructor(ctx);
                const result = await routeBinding.action.controllerMethod.apply(controllerInstance, parsedValues);
                handleResult(result, res);
            } catch (err) {
                handleError(err, res);
            }
        });
    }
}
export const RouteBinder = new DefaultRouteBinder();

function getRawValues(ctx: HttpContext): [ModelBindingMetadata, any][] {

    const action = ctx.routeBinding.action;
    const rawValues: [ModelBindingMetadata, any][] = [];
    const errorMessages: string[] = [];
    action.modelBindings.map(async modelBinding => {
        try {
            const targetParameter = action.parameters[modelBinding.target.parameterIndex];
            const rawValue = await modelBinding.getRawValue(ctx, targetParameter);
            rawValues.push([modelBinding, rawValue]);
        } catch (err) {
            errorMessages.push(err.message || err);
        }
    });

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