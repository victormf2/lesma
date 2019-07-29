import { Controller, Injectable, Scope, RestContext, Caracol, Type, Query, Post, Reflectable } from "../src";

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

@Reflectable()
export class NestedNested {
    constructor(
        @Type(Array, [Array, [String]])
        readonly strMatrix: string[][],

        @Type(Array, [Array, [Number]])
        readonly numMatrix: number[][]
    ) {

    }
}

@Reflectable()
export class Nested {
    constructor(
        @Type(Array, [String])
        readonly strArray: string[],
        @Type(Array, [Number])
        readonly numArray: number[],
        @Type(Array, [Date])
        readonly dateArray: Date[],
        @Type(Array, [Boolean])
        readonly boolArray: boolean[],
        @Type(Array, [NestedNested])
        readonly objArray: NestedNested[]
    ) {

    }
}

@Reflectable()
export class Teste {
    eita() {
        return "a";
    }
    constructor(
        readonly str: string,
        @Query("num")
        readonly num: number,
        readonly date: Date,
        readonly bool: boolean,
        readonly obj: Nested 
    ) {

    }
}

@Controller("controller")
export class MyController {

    constructor(
        public caracol: Caracol<RestContext>,
        public singleton: Singleton,
        public context: Context
    ) {
    }

    @Post("action")
    public post(count: number, teste: Teste) {
        console.log(teste);
        return {
            request: count,
            singleton: ++this.singleton.count,
            context: ++this.context.count,
        }
    }
}