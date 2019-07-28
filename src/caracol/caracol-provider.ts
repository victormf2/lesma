import { Caracol } from "./caracol";

export interface ICaracolProvider {
    getCaracol<C>(ctx: C): Caracol<C>
}