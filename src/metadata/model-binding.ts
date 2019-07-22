import { ParameterInfo } from "./parameter-metadata";
import { HttpContext } from "../request-handling/http-context";
import { ModelBindingException } from "../exceptions/model-exceptions";

export abstract class ModelBindingMetadata {
    constructor(
        readonly target: ModelBindingTarget
    ) {}

    abstract getRawValue(ctx: HttpContext, targetParameter: ParameterInfo): Promise<any>
}

export class ModelBindingTarget {
    constructor(
        readonly parameterIndex: number,
        readonly targetPath?: string // TODO parse path to build complex objects from model binding
    ) {
        
    }
}

export function getBindingTarget(controllerPrototype: Object, methodName: string, parameterIndex: number) {
    const target = new ModelBindingTarget(parameterIndex);
    return target;
}

export class QueryModelBinding extends ModelBindingMetadata {
    constructor(
        readonly name: string,
        target: ModelBindingTarget
    ) {
        super(target);
    }

    async getRawValue(ctx: HttpContext, targetParameter: ParameterInfo): Promise<any> {
        const queryValue = ctx.req.query[this.name];
        if (typeof queryValue === "undefined" && !targetParameter.hasDefaultValue) {
            throw new ModelBindingException(`Query parameter ${this.name} is required`);
        }
        return queryValue;
    }
}

export class PathModelBinding extends ModelBindingMetadata {
    constructor(
        readonly name: string,
        target: ModelBindingTarget
    ) {
        super(target);
    }

    async getRawValue(ctx: HttpContext, targetParameter: ParameterInfo): Promise<any> {
        const pathValue = ctx.req.params[this.name];
        if (typeof pathValue === "undefined" && !targetParameter.hasDefaultValue) {
            throw new ModelBindingException(`Path value ${this.name} is required`);
        }
        return pathValue;
    }
}

export class HeaderModelBinding extends ModelBindingMetadata {
    constructor(
        readonly name: string,
        target: ModelBindingTarget
    ) {
        super(target);
    }

    async getRawValue(ctx: HttpContext, targetParameter: ParameterInfo): Promise<any> {
        const headerValue = ctx.req.header(this.name);
        if (typeof headerValue === "undefined" && !targetParameter.hasDefaultValue) {
            throw new ModelBindingException(`Header ${this.name} is required`);
        }
        return headerValue;
    }
}

export class DefaultModelBinding extends ModelBindingMetadata {
    constructor(
        target: ModelBindingTarget
    ) {
        super(target);
    }

    async getRawValue(ctx: HttpContext, targetParameter: ParameterInfo): Promise<any> {
        const req = ctx.req;
        if (typeof req.params[targetParameter.name] !== "undefined") {
            return req.params[targetParameter.name];
        } else if (typeof req.query[targetParameter.name] !== "undefined") {
            return req.query[targetParameter.name];
        } else if (req.method !== "GET" && this.target.parameterIndex === ctx.routeBinding.action.parameters.length - 1) {
            return req.body;
        } else {
            if (!targetParameter.hasDefaultValue) {
                throw new Error(`Could not set required parameter ${targetParameter.name}`);
            }
        }
    }
}