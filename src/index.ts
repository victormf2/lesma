import * as exceptions from "./exceptions";
import { Controller, Query, Get } from "./decorators";
import { Lesma } from "./lesma";
export * from "./lesma"
export {
    exceptions
}


@Controller("dae")
export class ExampleController {

    constructor(
        readonly teste: string
    ) {}

    @Get()
    async get(@Query("naosei") teste: number, nuebo: Date) {
        
    }
}

new ExampleController("kk");

let lesma = new Lesma();
lesma.start();