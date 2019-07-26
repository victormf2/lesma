import { Constructor } from "../../_types";
import { Metadata } from "../../metadata";
import { FormatSpecifier } from "../format-specifier";

const LabelMetadataKey = "lesma:display-label";
export function setLabel(label: string, constructor: Constructor | Function, propertyName: string, parameterIndex?: number) {
    if (typeof parameterIndex === "number") {
        const map = Metadata.getMapMetadata<number, string>(LabelMetadataKey, constructor.prototype, propertyName);
        map.set(parameterIndex, label);
    } else {
        Reflect.defineMetadata(LabelMetadataKey, label, constructor.prototype, propertyName);
    }
}
export function getLabel(constructor: Constructor, propertyName: string, parameterIndex?: number): string {
    if (typeof parameterIndex === "number") {
        const map = Metadata.getMapMetadata<number, string>(LabelMetadataKey, constructor.prototype, propertyName);
        return map.get(parameterIndex);
    } else {
        return Reflect.getMetadata(LabelMetadataKey, constructor.prototype, propertyName);
    }
}

const FormatMetadataKey = "lesma:display-format";
export function setFormat(format: FormatSpecifier, constructor: Constructor | Function, propertyName: string, parameterIndex?: number) {
    if (typeof parameterIndex === "number") {
        const map = Metadata.getMapMetadata<number, FormatSpecifier>(FormatMetadataKey, constructor.prototype, propertyName);
        map.set(parameterIndex, format);
    } else {
        Reflect.defineMetadata(FormatMetadataKey, format, constructor.prototype, propertyName);
    }
}
export function getFormat(constructor: Constructor, propertyName: string, parameterIndex?: number): FormatSpecifier {
    if (typeof parameterIndex === "number") {
        const map = Metadata.getMapMetadata<number, FormatSpecifier>(FormatMetadataKey, constructor.prototype, propertyName);
        return map.get(parameterIndex);
    } else {
        return Reflect.getMetadata(FormatMetadataKey, constructor.prototype, propertyName);
    }
}