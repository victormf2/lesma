import { RestContext } from "./rest-context";

export interface IActionFilter {
    filter(ctx: RestContext): Promise<void>
}