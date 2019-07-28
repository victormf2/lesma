import { ICaracolProvider } from "../caracol-provider";
import { DefaultCaracol } from "./caracol.impl";

export class DefaultCaracolProvider implements ICaracolProvider {
    getCaracol<C>(ctx: C) {
        return new DefaultCaracol(ctx);
    }
}