import { Constructor } from "../types";
import { Scope } from "../metadata/dependency-metadata";
import { addDependency } from "../metadata/metadata-helpers";

export function Injectable(scope: Scope = Scope.Transient) {
    const decorator = (constructor: Constructor) => {
        Reflect.defineMetadata("lesma:injectable", scope, constructor);
        addDependency(constructor, scope);
    }
    return decorator;
}
