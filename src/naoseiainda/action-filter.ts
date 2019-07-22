import { HttpContext } from "./http-context";

export interface IActionFilter {
    filter(ctx: HttpContext): Promise<void>
}