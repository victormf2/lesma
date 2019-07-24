import { IRouteCollection } from "./route-collection";

export interface IRouteProvider {
    getRouteCollection(): IRouteCollection;
}