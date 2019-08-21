import { Type } from "../_types";
import { Metadata } from "..";
import { Decorator } from "./reflection-info";

const ReflectionMetadata = {}

const TypesMetadataKey = "lesma:reflection:types"
export function addType(type: Type) {
    Metadata.addToSet(type, TypesMetadataKey, ReflectionMetadata)
}
export function getTypes(): IterableIterator<Type> {
    return Metadata.getSetValues(TypesMetadataKey, ReflectionMetadata)
}
export function setConstructorParameterType(type: Type, parameterIndex: number, parameterType: Type, genericParameters: any[]) {
    addType(type)
    Metadata.defineAtArray([parameterType, genericParameters], parameterIndex, [TypesMetadataKey, "constuctor-parameter-types"], type)
}
export function getConstructorParameterTypes(type: Type): any[] {
    return Metadata.getArray([TypesMetadataKey, "constuctor-parameter-types"], type)
}

const MethodsMetadataKey = "lesma:reflection:methods"
export function addMethod(type: Type, methodName: string) {
    addType(type)
    Metadata.addToSet(methodName, MethodsMetadataKey, type)
}
export function getMethods(type: Type): IterableIterator<string> {
    return Metadata.getSetValues(MethodsMetadataKey, type)
}
export function setMethodParameterType(type: Type, methodName: string, parameterIndex: number, parameterType: Type, genericParameters: any[]) {
    addMethod(type, methodName)
    Metadata.defineAtArray([parameterType, genericParameters], parameterIndex, [MethodsMetadataKey, "parameter-types", methodName], type)
}
export function getMethodParameterTypes(type: Type, methodName: string): any[] {
    return Metadata.getArray([MethodsMetadataKey, "parameter-types", methodName], type)
}

const PropertiesMetadataKey = "lesma:reflection:properties"
export function addProperty(type: Type, propertyName: string) {
    addType(type)
    Metadata.addToSet(propertyName, PropertiesMetadataKey, type)
}
export function getProperties(type: Type): IterableIterator<string> {
    return Metadata.getSetValues(PropertiesMetadataKey, type)
}
export function setPropertyType(type: Type, propertyName: string, propertyType: Type, genericParameters: any) {
    addProperty(type, propertyName)
    Metadata.define([propertyType, genericParameters], [PropertiesMetadataKey, "type", propertyName], type)
}
export function getPropertyType(type: Type, propertyName: string): any[] {
    return Metadata.get([PropertiesMetadataKey, "type", propertyName], type)
}

const DecoratorsMetadataKey = "lesma:reflection:decorators"
export function addClassDecorator(type: Type, decorator: Decorator) {
    addType(type)
    Metadata.addToSet(decorator, DecoratorsMetadataKey, type)
}
export function getClassDecorators(type: Type): IterableIterator<Decorator> {
    return Metadata.getSetValues(DecoratorsMetadataKey, type)
}

export function addMethodDecorator(type: Type, methodName: string, decorator: Decorator) {
    addMethod(type, methodName)
    Metadata.addToSet(decorator, [DecoratorsMetadataKey, "method", methodName], type)
}
export function getMethodDecorators(type: Type, methodName: string): IterableIterator<Decorator> {
    return Metadata.getSetValues([DecoratorsMetadataKey, "method", methodName], type)
}

export function addPropertyDecorator(type: Type, propertyName: string, decorator: Decorator) {
    addProperty(type, propertyName)
    Metadata.addToSet(decorator, [DecoratorsMetadataKey, "property", propertyName], type)
}
export function getPropertyDecorators(type: Type, propertyName: string): IterableIterator<Decorator> {
    return Metadata.getSetValues([DecoratorsMetadataKey, "property", propertyName], type)
}

export function addConstructorParameterDecorator(type: Type, parameterIndex: number, decorator: Decorator) {
    addType(type)
    Metadata.addToSet(decorator, [DecoratorsMetadataKey, "constructor-parameters", parameterIndex.toString()], type)
}
export function getConstructorParameterDecorators(type: Type, parameterIndex: number): IterableIterator<Decorator> {
    return Metadata.getSetValues([DecoratorsMetadataKey, "constructor-parameters", parameterIndex.toString()], type)
}

export function addMethodParameterDecorator(type: Type, methodName: string, parameterIndex: number, decorator: Decorator) {
    addMethod(type, methodName)
    Metadata.addToSet(decorator, [DecoratorsMetadataKey, "method-parameters", methodName, parameterIndex.toString()], type)
}
export function getMethodParameterDecorators(type: Type, methodName: string, parameterIndex: number): IterableIterator<Decorator> {
    return Metadata.getSetValues([DecoratorsMetadataKey, "method-parameters", methodName, parameterIndex.toString()], type);
}