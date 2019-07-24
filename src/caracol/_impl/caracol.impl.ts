import { DependencyFactory, ICaracol } from "../caracol";
import { Constructor } from "../../_types";
import { CaracolMetadata, Scope } from "../metadata";

class DependencyScope {
    
    private instances = new Map();
    get<T>(key: any, factory: DependencyFactory<T>, caracol: ICaracol) {
        if (!this.instances.has(key)) {
            this.instances.set(key, factory(caracol))
        }
        return this.instances.get(key);
    }
}

const SingletonScope = new DependencyScope();

export class DefaultCaracol implements ICaracol {

    private contextScope: DependencyScope
    constructor(
        private ctx: any,
    ) {
        this.contextScope = new DependencyScope();
    }

    get<T>(key: string): T;
    get<T>(type: Constructor<T>): T;
    get<T>(key: string | Constructor<T>): T {
        if (this.ctx.constructor === key) {
            return this.ctx;
        }
        const dependencies = CaracolMetadata.getDependencies<T>();
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