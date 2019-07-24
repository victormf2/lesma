import "reflect-metadata";
import { Scope, CaracolMetadata } from "../metadata";
import { Constructor } from "../../_types";

export function Injectable(scope: Scope = Scope.Transient) {
    const decorator = (constructor: Constructor) => {
        Reflect.defineMetadata("lesma:injectable", scope, constructor);
        CaracolMetadata.addDependency(constructor, scope);
    }
    return decorator;
}
