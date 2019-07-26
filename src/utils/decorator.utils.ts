type GenericDecorator = (a: any, b: any, c: any) => any;

export function merge(...decorators: ClassDecorator[]): ClassDecorator
export function merge(...decorators: PropertyDecorator[]): PropertyDecorator
export function merge(...decorators: MethodDecorator[]): MethodDecorator
export function merge(...decorators: ParameterDecorator[]): ParameterDecorator
export function merge(...decorators: GenericDecorator[]): GenericDecorator {
    const merged = (a: any, b: any, c: any) => {
        for (let decorator of decorators) {
            decorator(a, b, c);
        }
    }
    return merged;
}