
import { ICaracolProvider } from "../../caracol/caracol-provider";
import { TypeInfo } from "../../metadata/type-info";
import { HttpException } from "../exceptions";
import { getParamRawValues } from "../model-binding";
import { ParserProvider } from "../parsers";
import { RestContext } from "../rest-context";
import { IRouteBinder, Route } from "../routing";
import express = require("express");

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
                * 1º: Iterar os parameter ModelBindings e montar o array do paramRawValues
                * 2º: Para os parameterIndexes vazios:
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

                const paramRawValues = await getParamRawValues(ctx, ctx.route.action.parameters, ctx.route.action.modelBindings);
                fillEmptyRawValues(route, paramRawValues, ctx);
                const getParsedValues = route.action.parameters.map((parameter, index) => parse(paramRawValues[index], parameter.type))
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

async function parse(rawValue: any, typeInfo: TypeInfo): Promise<any> {
    const parser = ParserProvider.get(typeInfo);
    return parser.parse(rawValue, typeInfo);
}

function fillEmptyRawValues(route: Route, paramRawValues: any[], ctx: RestContext) {
    route.action.parameters.forEach((parameter, index) => {
        if (typeof paramRawValues[index] !== "undefined") {
            return;
        }
        const req = ctx.req;
        if (typeof req.query[parameter.name] !== "undefined") {
            paramRawValues[index] = req.query[parameter.name];
        }
    });
    if (typeof paramRawValues[paramRawValues.length - 1] === "undefined") {
        if (ctx.req.method !== "GET") {
            paramRawValues[paramRawValues.length - 1] = ctx.req.body;
        }
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