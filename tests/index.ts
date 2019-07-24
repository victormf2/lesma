import * as lesma from "../src";
import "./ueba";

const caramujo = lesma.create();
caramujo.use(new lesma.RestPlugin({
    port: 5430
}));
caramujo.start();