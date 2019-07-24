import { ICaracolProvider } from "../caracol";

export interface ILesma {
    use(plugin: ILesmaPlugin): void
    start(): void
}

export interface ILesmaPlugin {
    setup(caracolProvider: ICaracolProvider): void
    start(): void
}