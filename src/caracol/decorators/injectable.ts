import "reflect-metadata";
import { Scope, CaracolMetadata } from "../metadata";
import { Constructor } from "../../_types";

export function Injectable(scope: Scope = Scope.Transient) {
    const decorator = (constructor: Constructor) => {
        CaracolMetadata.setInjection(scope, constructor);
    }
    return decorator;
}
