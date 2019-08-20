import { DependencyInfo, Scope } from "./dependency-info";
import { DependencyFactory, Caracol } from "../caracol";
import { Metadata } from "../../metadata";
import { Constructor, AbstractConstructor } from "../../_types";

const InjectableMetadataKey = "lesma:injectable";
export function setInjection(scope: Scope, constructor: Constructor) {
    Reflect.defineMetadata(InjectableMetadataKey, scope, constructor);
    addDependency(constructor, scope);
}
export function isInjectable(constructor: Constructor): boolean {
    return !!Reflect.getMetadata(InjectableMetadataKey, constructor);
}

const DependencyMetadataKey = "lesma:dependencies";
export function getDependencies<C, T>(): Map<any, DependencyInfo<C, T>> {
    let metadata: Map<any, DependencyInfo<C, T>> = Reflect.getMetadata(DependencyMetadataKey, Metadata.MetadataBase);
    if (!metadata) {
        metadata = new Map();
        Reflect.defineMetadata(DependencyMetadataKey, metadata, Metadata.MetadataBase);
    }
    return metadata;
}
export function addDependency<T>(key: string, instance: T): void;    
export function addDependency<C, T>(key: string | AbstractConstructor<T>, DependencyInfo: DependencyInfo<C, T>): void;
export function addDependency<C, T>(key: string, scope: Scope, factory: DependencyFactory<C, T>): void;
export function addDependency<C, T>(type: Constructor<T>): void;
export function addDependency<C, T>(type: Constructor<T>, scope: Scope): void;
export function addDependency<C, T>(type: AbstractConstructor<T>, scope: Scope, factory: DependencyFactory<C, T>): void;
export function addDependency<C, T>(key: string | AbstractConstructor<T>, p2?: T | Scope | DependencyInfo<T>, factory?: DependencyFactory<C, T>) {
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
        return addDependency<C, T>(key, new DependencyInfo<C, T>(scope, factory || getDefaultFactory<C, T>(key as Constructor)));
    }
}

function getDefaultFactory<C, T>(constructor: Constructor<T>): DependencyFactory<C, T> {
    let constructorTypes: Constructor[] = Reflect.getMetadata("design:paramtypes", constructor)
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