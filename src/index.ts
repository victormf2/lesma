import * as exceptions from "./exceptions";
import { Controller, Query, Get } from "./decorators";
import { Lesma } from "./lesma";
export * from "./lesma"
export {
    exceptions
}


@Controller("dae")
export class ExampleController {

    @Get()
    async get(@Query("naosei") teste: number, nuebo: Date) {
        
    }
}

new ExampleController();

let lesma = new Lesma();
lesma.start();