import { Type } from "../_types";
import { CaracolMetadata, Scope } from "./metadata";

export type DependencyFactory<C, T> = (caracol: Caracol<C>) => T;
export abstract class Caracol<C> {
    abstract get<T>(key: string | Type<T> | Function): T
    abstract ctx: C
}
CaracolMetadata.addDependency(Caracol, Scope.Context, caracol => caracol);