import { DependencyFactory } from "../caracol";

export enum Scope {
    Transient = "Transient",
    Context = "Context",
    Singleton = "Singleton",
}

export class DependencyInfo<T = any> {
    constructor(
        readonly scope: Scope,
        readonly factory: DependencyFactory<T>
    ) {

    }
}
