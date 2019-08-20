import { Constructor } from "../../../_types";
import { ParserMetadata } from "../metadata";
import { decorate } from "../../../_helpers";

export function Parser(key: string | Constructor): ParameterDecorator | PropertyDecorator {
    const decorator = decorate().parameter((target, methodName, parameterIndex) => {
        ParserMetadata.setParserKey(key, target, parameterIndex)
    })
    .property(() => { throw new Error("Property pasrser not implemented") })
    return decorator.value()
}