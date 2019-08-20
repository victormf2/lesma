import { ModelBindingInfo, ModelBindingTarget } from "./model-binding-info";
import { RestContext } from "../../rest-context";
import { ParameterInfo } from "../../../metadata/parameter-info";

export class QueryModelBinding extends ModelBindingInfo {
    constructor(
        readonly name: string,
        target: ModelBindingTarget
    ) {
        super(target);
    }

    async getRawValue(ctx: RestContext, targetParameter: ParameterInfo): Promise<any> {
        const queryValue = ctx.req.query[this.name];
        return queryValue;
    }
}