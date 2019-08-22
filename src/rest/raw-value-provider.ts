import { RestContext, RawValue } from "."

export interface IRawValueProvider {
    getRawValue(ctx: RestContext): Promise<RawValue>
}