import { Controller, Post } from "./decorators";
import { RequestParameter } from "./decorators/validation-decorators";
import { Lesma } from "./lesma";

@RequestParameter()
export class Values {
    constructor(
        public v: string
    ) {

    }

    public FF(nn = "abc") {
        console.log(nn);
    }
}

@Controller()
export class MyController {
    @Post("ueba/:id")
    public async get(id: number, values: Values) {
        return (typeof id === "number");
    }
}

const lesma = new Lesma({
    port: 3000
});
lesma.start();

