import { Constructor } from "../_types";

export class TypeInfo {
    constructor(
        readonly type: Constructor,
        readonly parameters?: Array<TypeInfo>
    ) {
        
    }
}