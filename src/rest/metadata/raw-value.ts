export interface RawValue {
    value: any,
    type: RawValueType
}

export enum RawValueType {
    String,
    Json
}