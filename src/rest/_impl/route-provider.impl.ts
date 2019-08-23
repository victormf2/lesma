import { Reflection, ReflectionMetadata } from "../../reflection";
import { toArray } from "../../_helpers";
import { ControllerDecorator } from "../decorators";
import { ControllerInfo } from "../metadata";
import { IRouteCollection, IRouteProvider } from "../routing";
import { RouteCollection } from "./route-collection.impl";

export class DefaultRouteProvider implements IRouteProvider {

    getRouteCollection(): IRouteCollection {
        return new RouteCollection(toArray(this.getControllers()));
    }

    private * getControllers(): IterableIterator<ControllerInfo> {
        const types = ReflectionMetadata.getTypes()
        for (let type of types) {
            const typeInfo = Reflection.getTypeInfo(type)
            const controllerDecorator = typeInfo.getDecorator(ControllerDecorator)
            if (controllerDecorator) {
                yield new ControllerInfo(typeInfo, controllerDecorator)
            }
        }
    }
}