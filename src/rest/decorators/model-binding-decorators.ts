import { QueryModelBinding, PathModelBinding, HeaderModelBinding, ModelBindingTarget, ModelBindingInfo, ParameterModelBindingTarget, PropertyModelBindingTarget } from "../metadata";
import { RestMetadata } from "../metadata";

type ModelBindingFactory = (target: ModelBindingTarget) => ModelBindingInfo;
function ModelBindingDecorator(factory: ModelBindingFactory): ParameterDecorator | PropertyDecorator {
    const decorator: ParameterDecorator | PropertyDecorator = function(target: Object, propertyKey: string, parameterIndex?: number) {
        const bindingTarget = getModelBindingTarget(target, propertyKey, parameterIndex);
        const modelBinding = factory(bindingTarget);
        if (!propertyKey) {
            RestMetadata.addModelBinding(modelBinding, target as any);
        } else {
            RestMetadata.addModelBinding(modelBinding, target.constructor, propertyKey);
        }
    }
    return decorator;
}

function getModelBindingTarget(target: Object, propertyKey: string, parameterIndex: number): ModelBindingTarget {
    if (typeof parameterIndex === "number") {
        return new ParameterModelBindingTarget(parameterIndex);
    } else {
        return new PropertyModelBindingTarget(target.constructor as any, propertyKey);
    }
}

export function Query(name: string): ParameterDecorator | PropertyDecorator {
    return ModelBindingDecorator(target => new QueryModelBinding(name, target));
}

export function Path(name: string): ParameterDecorator | PropertyDecorator {
    return ModelBindingDecorator(target => new PathModelBinding(name, target));
}

export function Header(name: string): ParameterDecorator | PropertyDecorator {
    return ModelBindingDecorator(target => new HeaderModelBinding(name, target));
}