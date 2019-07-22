import { MetadataProvider } from "../metadata";
import { QueryModelBinding, PathModelBinding, HeaderModelBinding, getBindingTarget } from "../metadata/model-binding";

export function RequestParameter() {
    const decorator: ClassDecorator = (target: any) => {

    };
    return decorator;
}

export function Query(name: string) {
    const decorator: ParameterDecorator = function(controllerPrototype: Object, methodName: string, parameterIndex: number) {
        const target = getBindingTarget(controllerPrototype, methodName, parameterIndex);
        const modelBinding = new QueryModelBinding(name, target);
        MetadataProvider.addModelBinding(modelBinding, controllerPrototype, methodName);
    }
    return decorator;
}

export function Path(name: string) {
    const decorator: ParameterDecorator = function(controllerPrototype: Object, methodName: string, parameterIndex: number) {
        const target = getBindingTarget(controllerPrototype, methodName, parameterIndex);
        const modelBinding = new PathModelBinding(name, target);
        MetadataProvider.addModelBinding(modelBinding, controllerPrototype, methodName);
    }
    return decorator;
}

export function Header(name: string) {
    const decorator: ParameterDecorator = function(controllerPrototype: Object, methodName: string, parameterIndex: number) {
        const target = getBindingTarget(controllerPrototype, methodName, parameterIndex);
        const modelBinding = new HeaderModelBinding(name, target);
        MetadataProvider.addModelBinding(modelBinding, controllerPrototype, methodName);
    }
    return decorator;
}