import { ModelBindingInfo, ModelBindingTarget } from "./model-binding-info";
import { RestContext } from "../../rest-context";
import { ParameterInfo } from "../../../metadata/parameter-info";
import { ModelBindingException } from "../../exceptions";

export class HeaderModelBinding extends ModelBindingInfo {
    constructor(
        readonly name: string,
        target: ModelBindingTarget
    ) {
        super(target);
    }

    async getRawValue(ctx: RestContext, targetParameter: ParameterInfo): Promise<any> {
        const headerValue = ctx.req.header(this.name);
        if (typeof headerValue === "undefined" && !targetParameter.hasDefaultValue) {
            throw new ModelBindingException(`Header ${this.name} is required`);
        }
        return headerValue;
    }
}