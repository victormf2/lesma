import { ParameterInfo } from "../../../metadata/parameter-info";
import { RestContext } from "../../rest-context";
import { Constructor } from "../../../_types";

export abstract class ModelBindingInfo {
    constructor(
        readonly target: ModelBindingTarget
    ) {}

    abstract getRawValue(ctx: RestContext, targetParameter: ParameterInfo): Promise<any>
}

export abstract class ModelBindingTarget {
}

export class ParameterModelBindingTarget extends ModelBindingTarget {
    constructor(
        readonly parameterIndex: number
    ) {
        super();
    }
}

export class PropertyModelBindingTarget extends ModelBindingTarget {
    constructor(
        readonly constuctor: Constructor,
        readonly propertyName: string,
    ) {
        super();
    }
}