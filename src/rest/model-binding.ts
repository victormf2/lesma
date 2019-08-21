import { RestContext } from "."
import { BadRequestException } from "./exceptions"
import { ParameterInfo } from "..";
import { ModelBindingDecorator } from "./decorators";

type DefaultValueFn = (parameter: ParameterInfo, ctx: RestContext) => any
const defaultValue: DefaultValueFn = () => undefined;
export async function getParamRawValues(ctx: RestContext, parameters: readonly ParameterInfo[], defaultValueFn: DefaultValueFn = defaultValue): Promise<any[]> {

    const errorMessages: string[] = []

    const getRawValues = parameters.map(async (parameter, index): Promise<any> => {
        try {
            const modelBinding = parameter.getDecorator<ModelBindingDecorator>(ModelBindingDecorator)
            if (!modelBinding) {
                return defaultValueFn(parameter, ctx);
            }
            const rawValue = await modelBinding.getRawValue(ctx)
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