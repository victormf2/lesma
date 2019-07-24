import { ModelBindingInfo, ModelBindingTarget } from "./model-binding-info";
import { RestContext } from "../../rest-context";
import { ParameterInfo } from "../../../metadata/parameter-info";
import { ModelBindingException } from "../../exceptions";

export class QueryModelBinding extends ModelBindingInfo {
    constructor(
        readonly name: string,
        target: ModelBindingTarget
    ) {
        super(target);
    }

    async getRawValue(ctx: RestContext, targetParameter: ParameterInfo): Promise<any> {
        const queryValue = ctx.req.query[this.name];
        if (typeof queryValue === "undefined" && !targetParameter.hasDefaultValue) {
            throw new ModelBindingException(`Query parameter ${this.name} is required`);
        }
        return queryValue;
    }
}