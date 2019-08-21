import "reflect-metadata"

function getMetadataKey(keyParams: string | string[]): string {
    if (Array.isArray(keyParams)) {
        return keyParams.join(":")
    }
    return keyParams
}

export function define<T>(value: T, keyParams: string | string[], target: any) {
    const key = getMetadataKey(keyParams)
    Reflect.defineMetadata(key, value, target)
}
export function get<T>(keyParams: string | string[], target: any) {
    const key = getMetadataKey(keyParams)
    return Reflect.getMetadata(key, target) as T
}

export function addToSet<T>(value: T, keyParams: string | string[], target: any) {
    const key = getMetadataKey(keyParams)
    let set: Set<T> = Reflect.getMetadata(key, target)
    if (!set) {
        set = new Set<T>()
        Reflect.defineMetadata(key, set, target)
    }
    set.add(value)
}

export function getSetValues<T>(keyParams: string | string[], target: any): IterableIterator<T> {
    const key = getMetadataKey(keyParams)
    const set: Set<T> = Reflect.getMetadata(key, target) || new Set<T>();
    return set.values()
}

export function addToArray<T>(value: T, keyParams: string | string[], target: any) {
    const array = getArray<T>(keyParams, target)
    array.push(value)
}
export function defineAtArray<T>(value: T, index: number, keyParams: string | string[], target: any) {
    const array = getArray<T>(keyParams, target)
    array[index] = value
}
export function getArray<T>(keyParams: string | string[], target: any): T[] {
    const key = getMetadataKey(keyParams)
    let array: T[] = Reflect.getMetadata(key, target)
    if (!array) {
        array = []
        Reflect.defineMetadata(key, array, target)
    }
    return array
}