export type AbstractConstructor<T = any> = Function & { prototype: T }
export interface Type<T = any> extends Function {
    new (...args: any[]): T
}
export type Prototype = Object & { constructor: Type };

export interface Method<T = any> extends Function {
    (...args: any[]): T
}