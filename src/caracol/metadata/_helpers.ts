import { DependencyInfo, Scope } from "./dependency-info";
import { DependencyFactory, Caracol } from "../caracol";
import { Type, AbstractType } from "../../_types";
import { Reflection } from "../../reflection";
import { InjectableDecorator } from "../decorators";

export function isInjectable(constructor: Type): boolean {
    const typeInfo = Reflection.getTypeInfo(constructor)
    return typeInfo.hasDecorator(InjectableDecorator)
}

const DependencyMetadata = {}

const DependencyMetadataKey = "lesma:dependencies";
export function getDependencies<C, T>(): Map<any, DependencyInfo<C, T>> {
    let metadata: Map<any, DependencyInfo<C, T>> = Reflect.getMetadata(DependencyMetadataKey, DependencyMetadata);
    if (!metadata) {
        metadata = new Map();
        Reflect.defineMetadata(DependencyMetadataKey, metadata, DependencyMetadata);
    }
    return metadata;
}
export function addDependency<T>(key: string, instance: T): void;    
export function addDependency<C, T>(key: string | AbstractType<T>, DependencyInfo: DependencyInfo<C, T>): void;
export function addDependency<C, T>(key: string, scope: Scope, factory: DependencyFactory<C, T>): void;
export function addDependency<C, T>(type: Type<T>): void;
export function addDependency<C, T>(type: Type<T>, scope: Scope): void;
export function addDependency<C, T>(type: AbstractType<T>, scope: Scope, factory: DependencyFactory<C, T>): void;
export function addDependency<C, T>(key: string | AbstractType<T>, p2?: T | Scope | DependencyInfo<T>, factory?: DependencyFactory<C, T>) {
    if (p2 instanceof DependencyInfo) {
        const dependencies = getDependencies();
        dependencies.set(key, p2);
        return;
    }
    if (typeof key === "string") {
        if (typeof factory !== "function") {
            const instance = p2;
            return addDependency(key, new DependencyInfo(Scope.Singleton, () => instance));
        }
        const scope = p2 as Scope;
        return addDependency(key, scope, factory);
    }
    if (typeof key === "function") {
        const scope = p2 as Scope || Scope.Transient;
        return addDependency<C, T>(key, new DependencyInfo<C, T>(scope, factory || getDefaultFactory<C, T>(key as Type)));
    }
}

function getDefaultFactory<C, T>(constructor: Type<T>): DependencyFactory<C, T> {
    let constructorTypes: Type[] = Reflect.getMetadata("design:paramtypes", constructor)
    if (!constructorTypes) {
        if (!isInjectable(constructor)) {
            throw new Error(`Default dependency injection require a decorator on class ${constructor.name}. You may use @Injectable to set scope.`);
        }
        constructorTypes = [];
    }
    return (caracol: Caracol<C>) => {
        const parameters = constructorTypes.map(type => caracol.get(type));
        return new constructor(...parameters);
    }
}