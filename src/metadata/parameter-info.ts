import { Constructor } from "../_types";

export class ParameterInfo {
    constructor(
        readonly name: string,
        readonly type: Constructor,
        readonly hasDefaultValue: boolean,
    ) {

    }
}