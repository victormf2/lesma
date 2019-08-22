import { Type, AbstractType } from "../../../_types";
import { decorate } from "../../../_helpers";
import { ReflectionMetadata, Decorator } from "../../../reflection";

export function Parser(key: string | Type): ParameterDecorator | PropertyDecorator {
    const decorator = decorate()
    .parameter((target, methodName, parameterIndex) => {
        ReflectionMetadata.addMethodParameterDecorator(target, methodName, parameterIndex, new ParserDecorator(key))
    })
    .ctorParam((target, parameterIndex) => {
        ReflectionMetadata.addConstructorParameterDecorator(target, parameterIndex, new ParserDecorator(key))
    })
    .property((target, propertyName) => { 
        ReflectionMetadata.addPropertyDecorator(target, propertyName, new ParserDecorator(key))
    })
    return decorator.value()
}

export class ParserDecorator extends Decorator {
    constructor(readonly dependencyKey: string | AbstractType) {
        super()
    }
}