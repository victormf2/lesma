import express = require("express");
import path = require("path");
import { ActionRoute, ControllerRoute } from "./lesma-routing-metadata";
import { BadRequestExecption, HttpException } from "./exceptions/http-exceptions";
import { ValidationError } from "./validation-error";
import { ParamInfo, getParamInfos } from "./reflection-utils";

export function parseRoute(app: express.Application, controller: ControllerRoute, action: ActionRoute) {
    const paramInfos = getParamInfos(action.methodDescriptor.value);
    const fullPath = path.posix.join("/", controller.path, action.path);
    app[action.httpMethod](fullPath, async (req, res, next) => {
        try {
            const paramRawValues = getRawValues(req, paramInfos, action);
            const paramTypes: any[] = Reflect.getMetadata("design:paramtypes", action.controllerPrototype, action.methodDescriptor.value.name);
            const values = paramRawValues.map((rawValue, index) => parseAndValidate(paramInfos[index].name, rawValue, paramTypes[index]));
            const validationErrors = values.filter(value => value instanceof ValidationError);
            if (validationErrors.length) {
                throw new BadRequestExecption(`Invalid request: ` + validationErrors.map(v => v.message).join(", "));
            }
            const controllerInstance = new controller.controllerConstructor();
            const result = await action.methodDescriptor.value.apply(controllerInstance, values);
            handleResult(result, res);
        } catch (err) {
            handleError(err, res);
        }
    });
}

function getRawValues(req: express.Request, paramInfos: ParamInfo[], route: ActionRoute): (string|undefined)[] {

    const length = paramInfos.length;
    let filledParams = new Array<boolean>(length).fill(false);
    const rawValues = paramInfos.map<string|undefined>((info, index) => {
        if (typeof req.params[info.name] !== 'undefined') {
            filledParams[index] = true;
            return req.params[info.name];
        }
        if (typeof req.query[info.name] !== 'undefined') {
            filledParams[index] = true;
            return req.query[info.name];
        }
        if (info.hasDefaultValue) {
            filledParams[index] = true;
        }
    });

    if (req.method !== "GET") {
        rawValues[length - 1] = req.body;
        filledParams[length - 1] = true;
    }

    const errorMessages: string[] = [];
    for (let i = 0; i < length; i++) {
        if (filledParams[i]) continue;
        errorMessages.push(`Parameter ${paramInfos[i].name} is required`);
    }

    if (errorMessages.length) {
        throw new BadRequestExecption("Invalid Request: " + errorMessages.join(", "));
    }

    return rawValues;
}

function parseAndValidate(paramName: string, rawValue: any, paramType: any): any {
    if (paramType == String) {
        return rawValue;
    } else if (paramType == Number) {
        const num = Number(rawValue);
        if (isNaN(num)) {
            return new ValidationError(`The value for ${paramName} is not a valid number: ${rawValue}`);
        }
        return num;
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