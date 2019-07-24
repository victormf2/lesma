import { ILesma, ILesmaPlugin } from "../lesma";
import { DefaultCaracolProvider } from "../../caracol/_impl";

export class Lesma implements ILesma {

    private plugins: ILesmaPlugin[] = [];
    private caracolProvider = new DefaultCaracolProvider();

    constructor(
    ) {
    }

    use(plugin: ILesmaPlugin): void {
        plugin.setup(this.caracolProvider);
        this.plugins.push(plugin);
    }

    start() {
        for (let plugin of this.plugins) {
            plugin.start();
        }
    }
}