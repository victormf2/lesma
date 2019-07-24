import { Controller, Get, Injectable, Scope, RestContext } from "../src";

@Injectable(Scope.Singleton)
export class Singleton {
    public count: number = 0;
    constructor() {}
}

@Injectable(Scope.Context)
export class Context {
    public count: number = 0;
    constructor() {}
}

@Controller("controller")
export class MyController {

    constructor(
        public rest: RestContext,
        public singleton: Singleton,
        public context: Context
    ) {
    }

    @Get("action")
    public get(count: number) {
        return {
            request: count,
            singleton: ++this.singleton.count,
            context: ++this.context.count,
        }
    }
}