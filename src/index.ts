import * as exceptions from "./exceptions";
import { Controller, Get } from "./decorators";
import { Lesma } from "./lesma";
import { HttpContext } from "./request-handling/http-context";
import { Injectable } from "./decorators/dependency-injection-decorators";
import { Scope } from "./metadata/dependency-metadata";
export * from "./lesma"
export {
    exceptions
}

@Injectable()
class MeuTrans {
    private count = 0;
    constructor() {

    }
    chama() {
        return ++this.count;
    }
}

@Injectable(Scope.Context)
class MeuConext {
    private count = 0;
    constructor() {

    }
    chama() {
        return ++this.count;
    }
}

@Injectable(Scope.Singleton)
class MeuSing {
    private count = 0;
    constructor(
        readonly meuContext: MeuConext,
        readonly meuTrans: MeuTrans,
    ) {
    }
    chama() {
        return ++this.count;
    }
}

@Controller("dae")
export class ExampleController {

    constructor(
        readonly ctx: HttpContext,
        readonly sing: MeuSing,
        readonly cont: MeuConext,
        readonly tans: MeuTrans,
    ) {}

    @Get()
    async get() {
        return { 
            singletonCount: this.sing.chama(),
            ctxInsideSingletonCount: this.sing.meuContext.chama(),
            ctxCount: this.cont.chama(),
            transInsideSingletonCount: this.sing.meuTrans.chama(),
            transCount: this.tans.chama()
        }
    }
}

let lesma = new Lesma();
lesma.start();