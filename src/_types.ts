export type AbstractConstructor<T = any> = Function & { prototype: T }
export interface Constructor<T = any> extends Function {
    new (...args: any[]): T
}
export type Prototype = Object & { constructor: Constructor };

export interface Method<T> {
    (...args: any[]): T
}