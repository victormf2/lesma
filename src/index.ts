import * as exceptions from "./exceptions";
import { Controller, Query } from "./decorators";
export * from "./lesma"
export {
    exceptions
}


@Controller("dae")
export class ExampleController {

    async get(@Query("naosei") teste: number) {
        
    }
}

new ExampleController();