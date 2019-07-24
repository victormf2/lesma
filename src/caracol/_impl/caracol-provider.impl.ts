import { ICaracolProvider } from "../caracol-provider";
import { DefaultCaracol } from "./caracol.impl";

export class DefaultCaracolProvider implements ICaracolProvider {
    getCaracol(ctx: any) {
        return new DefaultCaracol(ctx);
    }
}