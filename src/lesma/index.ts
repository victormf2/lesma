import { ILesma } from "./lesma";
import { Lesma } from "./_impl/lesma.impl";
export * from "./lesma";
export function create(): ILesma {
    return new Lesma();
}