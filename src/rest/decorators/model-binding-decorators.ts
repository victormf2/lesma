import { QueryModelBinding, PathModelBinding, HeaderModelBinding, ModelBindingTarget, ModelBindingInfo, ParameterModelBindingTarget, PropertyModelBindingTarget } from "../metadata";
import { RestMetadata } from "../metadata";
import { decorate } from "../../_helpers"

type ModelBindingFactory = (target: ModelBindingTarget) => ModelBindingInfo;
function ModelBindingDecorator(factory: ModelBindingFactory): ParameterDecorator | PropertyDecorator | ClassDecorator {
    const decorator = decorate()
    .parameter((target, methodName, parameterIndex) => {
        const bindingTarget = getModelBindingTarget(target, methodName, parameterIndex)
        const modelBinding = factory(bindingTarget);
        // if (!propertyKey) {
            RestMetadata.addModelBinding(modelBinding, target);
        // } else {
        //     RestMetadata.addModelBinding(modelBinding, target.constructor, propertyKey);
        // }
    })
    .property(() => { throw new Error("Property reflection not implemented yet.") });
    return decorator.value();
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