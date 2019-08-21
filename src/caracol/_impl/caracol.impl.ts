import { DependencyFactory, Caracol } from "../caracol";
import { CaracolMetadata, Scope } from "../metadata";
import { Type } from "../../_types";

class DependencyScope {
    
    private instances = new Map();
    get<C, T>(key: any, factory: DependencyFactory<C, T>, caracol: Caracol<C>) {
        if (!this.instances.has(key)) {
            this.instances.set(key, factory(caracol))
        }
        return this.instances.get(key);
    }
}

const SingletonScope = new DependencyScope();

export class DefaultCaracol<C> implements Caracol<C> {

    private contextScope: DependencyScope
    constructor(
        readonly ctx: C,
    ) {
        this.contextScope = new DependencyScope();
    }

    get<T>(key: string): T;
    get<T>(type: Type<T>): T;
    get<T>(key: string | Type<T>): T {
        const dependencies = CaracolMetadata.getDependencies<C, T>();
        const metadata = dependencies.get(key);
        const dependencyScope = this.getDependencyScope(metadata.scope);
        if (!dependencyScope) {
            return metadata.factory(this);
        }
        return dependencyScope.get(key, metadata.factory, this);
    }

    private getDependencyScope(scope: Scope): DependencyScope {
        if (scope === Scope.Singleton) {
            return SingletonScope;
        }
        if (scope === Scope.Context) {
            return this.contextScope;
        }
        return null;
    }
}
