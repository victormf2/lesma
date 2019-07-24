import { ModelBindingInfo, ModelBindingTarget } from "./model-binding-info";
import { RestContext } from "../../rest-context";
import { ParameterInfo } from "../../../metadata/parameter-info";
import { ModelBindingException } from "../../exceptions";


export class PathModelBinding extends ModelBindingInfo {
    constructor(
        readonly name: string,
        target: ModelBindingTarget
    ) {
        super(target);
    }

    async getRawValue(ctx: RestContext, targetParameter: ParameterInfo): Promise<any> {
        const pathValue = ctx.req.params[this.name];
        if (typeof pathValue === "undefined" && !targetParameter.hasDefaultValue) {
            throw new ModelBindingException(`Path value ${this.name} is required`);
        }
        return pathValue;
    }
}