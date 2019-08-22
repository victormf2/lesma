import { Type } from "./_types"

type CustomClassDecorator = (target: Type) => void | Type
type CustomPropertyDecorator = (target: Type, propertyName: string) => void
type CustomMethodDecorator = <T>(target: Type, methodName: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void
type CustomParameterDecorator = (target: Type, methodName: string, parameterIndex: number) => void
type ConstructorParameterDecorator = (target: Type, parameterIndex: number) => void
type AnyDecorator = ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator

class DecoratorHelper {
    private _class: CustomClassDecorator
    private _property: CustomPropertyDecorator
    private _method: CustomMethodDecorator
    private _parameter: CustomParameterDecorator
    private _ctorParam: ConstructorParameterDecorator

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

    public ctorParam(fn: ConstructorParameterDecorator): this {
        return this._ctorParam = fn, this
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
                if (typeof propertyKey === "undefined") {
                    return this._ctorParam(target, param)
                }
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

export function toArray<T>(iterable: IterableIterator<T>) {
    const arr = []
    for (let item of iterable) {
        arr.push(item)
    }
    return arr
}

export function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

export function typeOfOrNull(value: any, type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function") {
    return typeof value === type || value == null
}