import { MethodInfo } from "../../reflection";
import { RouteDecorator } from "../decorators";

export class ActionInfo {

    constructor(
        readonly methodInfo: MethodInfo,
        readonly routes: RouteDecorator[]
    ) {
    }
}