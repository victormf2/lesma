import { ReflectionInfoBuilder, TypeArgs } from "./reflection-info-builder";
import { TypeInfo } from "./reflection-info";

const builder = new ReflectionInfoBuilder({})
export function getTypeInfo(type: TypeArgs): TypeInfo {
    return builder.buildTypeInfo(type)
}