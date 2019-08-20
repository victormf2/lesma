import "reflect-metadata"
import { Scope, CaracolMetadata } from "../metadata"
import { decorate } from "../../_helpers"

export function Injectable(scope: Scope = Scope.Transient): ClassDecorator {
    const decorator = decorate().class(constructor => {
        CaracolMetadata.setInjection(scope, constructor)
    })
    return decorator.value()
}
