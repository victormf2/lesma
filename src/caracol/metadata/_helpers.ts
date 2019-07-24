import { DependencyInfo, Scope } from "./dependency-info";
import { DependencyFactory, ICaracol } from "../caracol";
import { Metadata } from "../../metadata";
import { Constructor } from "../../_types";

const schlebs = "lesma:dependencies";
export function getDependencies<T>(): Map<any, DependencyInfo<T>> {
    let metadata: Map<any, DependencyInfo> = Reflect.getMetadata(schlebs, Metadata.MetadataBase);
    if (!metadata) {
        metadata = new Map();
        Reflect.defineMetadata(schlebs, metadata, Metadata.MetadataBase);
    }
    return metadata;
}
export function addDependency<T>(key: string, instance: T): void;    
export function addDependency<T>(key: string, scope: Scope, factory: DependencyFactory<T>): void;
export function addDependency<T>(type: Constructor<T>, scope?: Scope, factory?: DependencyFactory<T>): void;
export function addDependency<T>(key: string | Constructor<T>, DependencyInfo: DependencyInfo<T>): void;
export function addDependency<T>(key: string | Constructor<T>, p2?: T | Scope | DependencyInfo<T>, factory?: DependencyFactory<T>) {
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
        return addDependency(key, new DependencyInfo(scope, factory || getDefaultFactory(key)));
    }
}

function getDefaultFactory<T>(constructor: Constructor<T>): DependencyFactory<T> {
    const constructorTypes: Constructor[] = Reflect.getMetadata("design:paramtypes", constructor)
    if (!constructorTypes) {
        throw new Error(`Default dependency injection require a decorator on class ${constructor.name}. You may use @Injectable to set scope.`);
    }
    return (caracol: ICaracol) => {
        const parameters = constructorTypes.map(type => caracol.get(type));
        return new constructor(...parameters);
    }
}