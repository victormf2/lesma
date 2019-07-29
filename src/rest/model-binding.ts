import { RestContext, ParameterModelBindingTarget } from "."
import { ParameterInfo } from "../metadata"
import { BadRequestException } from "./exceptions"
import { ModelBindingInfo } from "./metadata"

type DefaultValueFn = (parameter: ParameterInfo, ctx: RestContext) => any
const defaultValue: DefaultValueFn = () => undefined;
export async function getParamRawValues(ctx: RestContext, parameters: ParameterInfo[], modelBindings: ModelBindingInfo[], defaultValueFn: DefaultValueFn = defaultValue): Promise<any[]> {

    const errorMessages: string[] = []
    const mappedModelBindings = new Array(parameters.length)
    modelBindings.forEach(modelBinding => {
        if (modelBinding.target instanceof ParameterModelBindingTarget) {
            mappedModelBindings[modelBinding.target.parameterIndex] = modelBinding
        }
    })

    const getRawValues = parameters.map(async (parameter, index): Promise<any> => {
        try {
            const modelBinding = mappedModelBindings[index]
            if (!modelBinding) {
                return defaultValueFn(parameter, ctx);
            }
            const rawValue = await modelBinding.getRawValue(ctx, parameter)
            return rawValue
        } catch (err) {
            errorMessages.push(err.message || err)
        }
        return undefined
    });
    const rawValues: any[] = await Promise.all(getRawValues);

    if (errorMessages.length) {
        throw new BadRequestException("Model binding failed: " + errorMessages.join(", "));
    }

    return rawValues;
}