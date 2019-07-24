import { ICaracol } from "./caracol";

export interface ICaracolProvider {
    getCaracol(ctx: any): ICaracol
}