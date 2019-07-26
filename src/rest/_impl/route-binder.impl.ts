
import { ParameterInfo } from "../../metadata/parameter-info";
import { RestContext } from "../rest-context";
import { ValidationError } from "../../validation-error";
import { ICaracolProvider } from "../../caracol/caracol-provider";
import express = require("express");
import { ModelBindingInfo } from "../metadata";
import { IRouteBinder, Route } from "../routing";
import { BadRequestException, HttpException } from "../exceptions";

export class DefaultRouteBinder implements IRouteBinder {

    constructor(private caracolProvider: ICaracolProvider) {

    }

    bindRoute(app: express.Application, route: Route) {
        app[route.httpMethod](route.path, async (req, res, next) => {
            try {
                const ctx = new RestContext(req, res, route);
                const caracol = this.caracolProvider.getCaracol(ctx);

                /*
                TODO
                1º: Iterar os parameter ModelBindings e montar o array do paramRawValues
                2º: Para os parameterIndexes vazios:
                 - Verificar se eles estão na query e adicionar ao paramRawValues
                 - Se não: Verificar se o method não é GET e aplicar o body
                3º: paramRawValues.map(parse) => (que agora batem com os parâmetros do método)
                parse:
                 - Verificar se tem um custom parser (esse é um TODO)
                 - Se o tipo do parâmetro for simples, só faz o parse
                 - Se o tipo do parâmetro for Array, ver se usou o @Array (ou @Type preciso analisar esse é um TODO)
                 - Se o tipo do parâmetro for objeto complexo, chamar o parseComplex
                parseComplex (recursivo):
                    1º: Iterar os parameter ModelBindings do construtor e montar o array do paramRawValues
                    2º: Para os parameterIndexes vazios:
                    - Verificar se eles estão nas propriedades do body e adicionar ao paramRawValues
                    *** Arumar um jeito de aplicar o validador Required nos parâmetros sem defaultValue
                    3º: Iterar os property ModelBindings do construtor e montar o objeto propRawValues
                    4º: paramRawValues.map(parse) => que agora batem com os parâmetros do construtor
                    5º: propRawValues.map(parse) => que agora batem com as propriedades da classe
                */

                const paramRawValues = await getRawValues(ctx);
                const parsedValues = new Array<any>(route.action.parameters.length);
                const validationErrors: ValidationError[] = [];
                for (let [modelBinding, rawValue] of paramRawValues) {
                    const paramIndex = modelBinding.target.parameterIndex;
                    const parameter = route.action.parameters[paramIndex];
                    const parsedValue = parseAndValidate(rawValue, parameter, parsedValues[paramIndex], modelBinding.target.targetPath);
                    if (parsedValue instanceof ValidationError) {
                        validationErrors.push(parsedValue);
                        continue;
                    }
                    parsedValues[paramIndex] = parsedValue;
                }
                if (validationErrors.length) {
                    throw new BadRequestException(`Invalid request: ` + validationErrors.map(v => v.message).join(", "));
                }
                const controllerInstance = caracol.get(route.controller.controllerConstructor);
                const result = await route.action.controllerMethod.apply(controllerInstance, parsedValues);
                handleResult(result, res);
            } catch (err) {
                handleError(err, res);
            }
        });
    }
}

async function getRawValues(ctx: RestContext): Promise<[ModelBindingInfo, any][]> {

    const action = ctx.route.action;
    const rawValues: [ModelBindingInfo, any][] = [];
    const errorMessages: string[] = [];
    const getRawValues = action.modelBindings.map(async modelBinding => {
        try {
            const targetParameter = action.parameters[modelBinding.target.parameterIndex];
            const rawValue = await modelBinding.getRawValue(ctx, targetParameter);
            rawValues.push([modelBinding, rawValue]);
        } catch (err) {
            errorMessages.push(err.message || err);
        }
    });
    await Promise.all(getRawValues);

    if (errorMessages.length) {
        throw new BadRequestException("Invalid Request: " + errorMessages.join(", "));
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