import { MethodInfo, ParameterInfo } from "../../reflection";
import { RouteDecorator } from "../decorators";
import { ParserProvider } from "../parsers/parser-provider";
import { IParser } from "../parsers";
import { IRawValueProvider } from "..";
import { getRawValueProviders, ActionValueProvider } from "../_impl";

export class ActionInfo {

    constructor(
        readonly methodInfo: MethodInfo,
        readonly routes: RouteDecorator[]
    ) {
    }

    private _rawValueProviders: IRawValueProvider[]
    private get rawValueProviders() {
        if (!this._rawValueProviders) {
            this._rawValueProviders = getRawValueProviders(this.methodInfo.parameters, parameter => new ActionValueProvider(parameter))
        }
        return this._rawValueProviders
    }
    public getParameterBindings(parserProvider: ParserProvider): readonly ParameterBinding[] {
        const parameterBindings = this.rawValueProviders.map((valueProvider, index) => {
            const parameter = this.methodInfo.parameters[index]
            const parser = parserProvider.get(parameter.type)
            const binding: ParameterBinding = {
                parameter,
                parser,
                valueProvider
            }
            return binding
        })
        return parameterBindings
    }
}

export interface ParameterBinding {
    readonly parameter: ParameterInfo
    readonly parser: IParser<any>
    readonly valueProvider: IRawValueProvider
}