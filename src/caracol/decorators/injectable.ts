import "reflect-metadata"
import { Scope, CaracolMetadata } from "../metadata"
import { decorate } from "../../_helpers"
import { Decorator, ReflectionMetadata } from "../../reflection";

export function Injectable(scope: Scope = Scope.Transient): ClassDecorator {
    const decorator = decorate().class(target => {
        ReflectionMetadata.addClassDecorator(target, new InjectableDecorator(scope))
        CaracolMetadata.addDependency(target, scope);
    })
    return decorator.value()
}


export class InjectableDecorator extends Decorator {
    constructor(
        readonly scope: Scope
    ) {
        super()
    }
}