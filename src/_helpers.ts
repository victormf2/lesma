import { Constructor } from "./_types"

type CustomClassDecorator = (target: Constructor) => void | Constructor
type CustomPropertyDecorator = (target: Constructor, propertyName: string) => void
type CustomMethodDecorator = <T>(target: Constructor, methodName: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void
type CustomParameterDecorator = (target: Constructor, methodName: string, parameterIndex: number) => void
type AnyDecorator = ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator

class DecoratorHelper {
    private _class: CustomClassDecorator
    private _property: CustomPropertyDecorator
    private _method: CustomMethodDecorator
    private _parameter: CustomParameterDecorator

    public class(fn: CustomClassDecorator): this {
        return this._class = fn, this
    }

    public property(fn: CustomPropertyDecorator): this {
        return this._property = fn, this
    }

    public method(fn: CustomMethodDecorator): this {
        return this._method = fn, this
    }

    public parameter(fn: CustomParameterDecorator): this {
        return this._parameter = fn, this
    }

    public value<T>() : T
    public value(): AnyDecorator {
        const f: AnyDecorator = (target: any, propertyKey: any, param: any) => {
            if (typeof target.prototype === "undefined") {
                target = target.constructor
            }
            if (typeof param === "undefined") {
                if (typeof propertyKey === "undefined") {
                    return this._class(target)
                }
                return this._property(target, propertyKey)
            }
            if (typeof param === "number") {
                return this._parameter(target, propertyKey, param)
            }
            return this._method(target, propertyKey, param)
        }
        return f
    }
}

export function decorate(): DecoratorHelper {
    return new DecoratorHelper()
}
