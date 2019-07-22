
export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface Constructor<T = any> {
    new (...args: any[]): T
}

export interface ControllerMethod {
    (...args: any[]): Promise<any>
}