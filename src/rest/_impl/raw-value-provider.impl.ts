import { RestContext, ModelBindingDecorator } from ".."
import { ParameterInfo, RawValueType, RawValue } from "../..";
import { IRawValueProvider } from "../raw-value-provider";

export class ActionValueProvider implements IRawValueProvider {
    constructor(
        readonly parameter: ParameterInfo
    ) {
    }
    async getRawValue(ctx: RestContext): Promise<RawValue> {
        const req = ctx.req
        if (typeof req.query[this.parameter.name] !== "undefined") {
            return {
                value: req.query[this.parameter.name],
                type: RawValueType.String
            }
        }
        if (this.parameter.index === this.parameter.method.parameters.length - 1 && ctx.req.method !== "GET") {
            return { 
                value: ctx.req.body,
                type: RawValueType.Json
            }
        }
        throw new Error(`Could not assing a value to action parameter ${this.parameter.name}`)
    }
}

export class ComplexParserValueProvider implements IRawValueProvider {
    constructor(
        readonly parameter: ParameterInfo,
        readonly body: any
    ) {

    }
    
    async getRawValue(ctx: RestContext): Promise<RawValue> {
        return {
            value: this.body[this.parameter.name],
            type: RawValueType.Json
        }
    }

}

type RawValueProviderFallback = (parameter: ParameterInfo) => IRawValueProvider
export function getRawValueProviders(parameters: readonly ParameterInfo[], fallback: RawValueProviderFallback): IRawValueProvider[] {
    return parameters.map(parameter => {
        const modelBinding = parameter.getDecorator<ModelBindingDecorator>(ModelBindingDecorator);
        if (modelBinding) {
            return modelBinding
        }
        return fallback(parameter)
    })
}