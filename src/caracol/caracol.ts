import { Constructor } from "../_types";

export type DependencyFactory<T> = (caracol: ICaracol) => T;
export interface ICaracol {
    get<T>(key: string): T;
    get<T>(key: Constructor<T>): T;
}

