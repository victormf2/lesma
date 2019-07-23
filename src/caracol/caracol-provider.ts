import { ICaracol } from "./caracol";
import { DefaultCaracol } from "./impl";

export interface ICaracolProvider {
    getCaracol(ctx: any): ICaracol
}

class DefaultCaracolProvider implements ICaracolProvider {
    getCaracol(ctx: any) {
        return new DefaultCaracol();
    }
}

export const CaracolProvider = new DefaultCaracolProvider();