import { TypeInfo } from "./type-info";

export class ParameterInfo {
    constructor(
        readonly index: number,
        readonly name: string,
        readonly type: TypeInfo,
        readonly hasDefaultValue: boolean,
    ) {

    }
}