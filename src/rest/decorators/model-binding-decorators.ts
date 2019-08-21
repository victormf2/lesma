import { decorate } from "../../_helpers"
import { Decorator, ReflectionMetadata } from "../../reflection";
import { RestContext } from "../rest-context";

type DecoratorFactory = () => ModelBindingDecorator;
function modelBindingDecorator(factory: DecoratorFactory): ParameterDecorator | PropertyDecorator {
    const decorator = decorate()
    .ctorParam((target, parameterIndex) => {
        const decorator = factory();
        ReflectionMetadata.addConstructorParameterDecorator(target, parameterIndex, decorator)
    })
    .property(() => { throw new Error("Property reflection not implemented yet.") });
    return decorator.value();
}

export abstract class ModelBindingDecorator extends Decorator {
    abstract getRawValue(ctx: RestContext): Promise<any>
}

export function Query(name: string): ParameterDecorator | PropertyDecorator {
    return modelBindingDecorator(() => new QueryDecorator(name));
}
export class QueryDecorator extends ModelBindingDecorator {
    constructor(
        readonly name: string,
    ) {
        super();
    }

    async getRawValue(ctx: RestContext): Promise<any> {
        const queryValue = ctx.req.query[this.name || this.member.name];
        return queryValue;
    }
}

export function Path(name: string): ParameterDecorator | PropertyDecorator {
    return modelBindingDecorator(() => new PathDecorator(name));
}
export class PathDecorator extends ModelBindingDecorator {
    constructor(
        readonly name: string
    ) {
        super();
    }

    async getRawValue(ctx: RestContext): Promise<any> {
        const pathValue = ctx.req.params[this.name || this.member.name];
        return pathValue;
    }
}

export function Header(name: string): ParameterDecorator | PropertyDecorator {
    return modelBindingDecorator(() => new HeaderDecorator(name));
}
export class HeaderDecorator extends ModelBindingDecorator {
    constructor(
        readonly name: string,
    ) {
        super();
    }

    async getRawValue(ctx: RestContext): Promise<any> {
        const headerValue = ctx.req.header(this.name || this.member.name);
        return headerValue;
    }
}