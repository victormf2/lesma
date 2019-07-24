import { ModelBindingInfo, ModelBindingTarget } from "./model-binding-info";
import { RestContext } from "../../rest-context";
import { ParameterInfo } from "../../../metadata/parameter-info";

export class DefaultModelBinding extends ModelBindingInfo {
    constructor(
        target: ModelBindingTarget
    ) {
        super(target);
    }

    async getRawValue(ctx: RestContext, targetParameter: ParameterInfo): Promise<any> {
        const req = ctx.req;
        if (typeof req.params[targetParameter.name] !== "undefined") {
            return req.params[targetParameter.name];
        } else if (typeof req.query[targetParameter.name] !== "undefined") {
            return req.query[targetParameter.name];
        } else if (req.method !== "GET" && this.target.parameterIndex === ctx.route.action.parameters.length - 1) {
            return req.body;
        } else {
            if (!targetParameter.hasDefaultValue) {
                throw new Error(`Could not set required parameter ${targetParameter.name}`);
            }
        }
    }
}