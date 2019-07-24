
export interface Constructor<T = any> {
    new (...args: any[]): T
}

export interface Method<T> {
    (...args: any[]): T
}