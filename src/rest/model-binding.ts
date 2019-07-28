import { RestContext, ParameterModelBindingTarget } from "."
import { ParameterInfo } from "../metadata"
import { BadRequestException } from "./exceptions"
import { ModelBindingInfo } from "./metadata"


export async function getParamRawValues(ctx: RestContext, parameters: ParameterInfo[], modelBindings: ModelBindingInfo[]): Promise<any[]> {

    const errorMessages: string[] = []
    const mappedModelBindings = new Array(parameters.length)
    modelBindings.forEach(modelBinding => {
        if (modelBinding.target instanceof ParameterModelBindingTarget) {
            mappedModelBindings[modelBinding.target.parameterIndex] = modelBinding
        }
    })

    const getRawValues = parameters.map(async (parameter, index): Promise<any> => {
        try {
            const modelBinding = mappedModelBindings[index];
            if (!modelBinding) {
                return undefined;
            }
            const rawValue = await modelBinding.getRawValue(ctx, parameter);
            return rawValue;
        } catch (err) {
            errorMessages.push(err.message || err);
        }
        return undefined;
    });
    const rawValues: any[] = await Promise.all(getRawValues);

    if (errorMessages.length) {
        throw new BadRequestException("Model binding failed: " + errorMessages.join(", "));
    }

    return rawValues;
}