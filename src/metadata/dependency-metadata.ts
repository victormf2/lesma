import { DependencyFactory } from "../caracol";

export enum Scope {
    Singleton = "Singleton",
    Context = "Context",
    Transient = "Transient"
}

export class DependencyMetadata<T = any> {
    constructor(
        readonly scope: Scope,
        readonly factory: DependencyFactory<T>
    ) {

    }
}
