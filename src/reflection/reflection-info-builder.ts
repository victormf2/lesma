import { TypeInfo, ConstructorInfo, ParameterInfo, MethodInfo, PropertyInfo } from "./reflection-info"
import { ReflectionMetadata } from ".";
import { Type } from "../_types";
import { toArray } from "../_helpers";

export class ReflectionInfoBuilder {
    constructor(
        private types: { [key: string]: TypeInfo }
    ) {

    }

    buildTypeInfo(typeArgs: TypeArgs): TypeInfo {
        const { type, genericParameters } = unwrapTypeArgs(typeArgs)
        const key = getTypeKey(type, genericParameters)
        if (this.types[key]) {
            return this.types[key]
        }
        const typeInfo = new TypeInfo(
            type, 
            this.buildConstructorInfo(type), 
            toArray(this.buildMethodInfos(type)), 
            toArray(ReflectionMetadata.getClassDecorators(type)), 
            toArray(this.buildPropertyInfos(type)), 
            genericParameters.map(g => this.buildTypeInfo(g))
        )
        this.types[key] = typeInfo
        return this.types[key]
    }

    private buildConstructorInfo(type: Type): ConstructorInfo {
        return new ConstructorInfo(
            type, 
            toArray(this.buildConstructorParameters(type))
        )
    }

    private * buildConstructorParameters(type: Type): IterableIterator<ParameterInfo> {
        if (isNativeType(type)) {
            return
        }
        const paramDeclarations = getConstructorParamDeclarations(type)
        const defaultParameterTypes = Reflect.getMetadata("design:paramtypes", type) as Type[] || []
        const definedParameterTypes = ReflectionMetadata.getConstructorParameterTypes(type)
        let parameterIndex = 0
        for (let { paramName, defaultValue } of paramDeclarations) {
            const decorators = toArray(ReflectionMetadata.getConstructorParameterDecorators(type, parameterIndex))
            const typeArgs = definedParameterTypes[parameterIndex] || defaultParameterTypes[parameterIndex]
            const parameterTypeInfo = typeArgs ? this.buildTypeInfo(typeArgs) : null
            const parameterInfo = new ParameterInfo(paramName, parameterTypeInfo, parameterIndex, defaultValue, decorators)
            yield parameterInfo
            parameterIndex++
        }
    }

    private * buildMethodInfos(type: Type): IterableIterator<MethodInfo> {
        if (isNativeType(type)) {
            return
        }
        const methodNames = ReflectionMetadata.getMethods(type)
        for (let methodName of methodNames) {
            yield this.buildMethodInfo(type, methodName)
        }
    }

    private buildMethodInfo(type: Type, methodName: string): MethodInfo {
        const method: Function = type.prototype[methodName]
        const methodInfo = new MethodInfo(
            method,
            toArray(this.buildMethodParameters(type, methodName)),
            toArray(ReflectionMetadata.getMethodDecorators(type, methodName))
        )
        return methodInfo
    }

    private * buildMethodParameters(type: Type, methodName: string): IterableIterator<ParameterInfo> {
        const paramDeclarations = getMethodParamDeclarations(type, methodName)
        const defaultParameterTypes = Reflect.getMetadata("design:paramtypes", type.prototype, methodName) as Type[] || []
        const definedParameterTypes = ReflectionMetadata.getMethodParameterTypes(type, methodName)
        let parameterIndex = 0
        for (let { paramName, defaultValue } of paramDeclarations) {
            const decorators = toArray(ReflectionMetadata.getMethodParameterDecorators(type, methodName, parameterIndex))
            const typeArgs = definedParameterTypes[parameterIndex] || defaultParameterTypes[parameterIndex]
            const parameterTypeInfo = typeArgs ? this.buildTypeInfo(typeArgs) : null
            const parameterInfo = new ParameterInfo(paramName, parameterTypeInfo, parameterIndex, defaultValue, decorators)
            yield parameterInfo
            parameterIndex++
        }
    }

    private * buildPropertyInfos(type: Type): IterableIterator<PropertyInfo> {
        if (isNativeType(type)) {
            return
        }
        const propertyNames = ReflectionMetadata.getProperties(type)
        for (let propertyName of propertyNames) {
            yield this.buildPropertyInfo(type, propertyName)
        }
    }

    private buildPropertyInfo(type: Type, propertyName: string): PropertyInfo {
        const defaultPropertyType = Reflect.getMetadata("design:paramtypes", type.prototype, propertyName)
        const definedPropertyType = ReflectionMetadata.getPropertyType(type, propertyName)
        const typeArgs = definedPropertyType || defaultPropertyType
        const propertyTypeInfo = typeArgs ? this.buildTypeInfo(typeArgs) : null
        const propertyInfo = new PropertyInfo(
            propertyName,
            propertyTypeInfo,
            toArray(ReflectionMetadata.getPropertyDecorators(type, propertyName))
        )
        return propertyInfo
    }
}


function getTypeKey(type: Type, genericParameters: TypeArgs[]) {
    const typeNames = [type, genericParameters].map(getTypeName)
    return JSON.stringify(typeNames)
}
function getTypeName(types: any): any {
    if (Array.isArray(types)) {
        return types.map(getTypeName)
    }
    return types.name
}

export type TypeArgs = Type | any[]
function unwrapTypeArgs(typeArgs: TypeArgs): { type: Type, genericParameters: TypeArgs[] } {
    if (Array.isArray(typeArgs)) {
        return {
            type: typeArgs[0],
            genericParameters: typeArgs[1] || []
        }
    }
    return {
        type: typeArgs,
        genericParameters: []
    }
}

function* getConstructorParamDeclarations(type: Type): IterableIterator<ParamDeclaration> {
    const match = type.toString().match(CONSTRUCTOR_FUNCTION)
    const length = match[0].length - match[1].length
    const ix = match.index + length
    const ctorStr = match.input.slice(ix);
    yield* getFunctionParamDeclarations(ctorStr);
}


function* getMethodParamDeclarations(type: Type, methodName: string): IterableIterator<ParamDeclaration> {
    const method = type.prototype[methodName]
    const fnStr = method.toString()
    yield* getFunctionParamDeclarations(fnStr);
}

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
const BETWEEN_PARENTHESIS = /\(\s*(.*?)\s*\)(?:\s*\{)/s
const ARGUMENT_NAMES = /([a-zA-Z$_]\w*)\s*(=.*)?(,|$)/gm
const CONSTRUCTOR_FUNCTION = /[^\w\s]\s*(constructor\s*\()/
type ParamDeclaration = { paramName: string, defaultValue: any }
function* getFunctionParamDeclarations(fnStr: string): IterableIterator<ParamDeclaration> {
    const uncommented = fnStr.replace(STRIP_COMMENTS, '');
    const paramsStr = uncommented.match(BETWEEN_PARENTHESIS)[1];
    let result = ARGUMENT_NAMES.exec(paramsStr);
    while (result) {
        yield { paramName: result[1], defaultValue: undefined /*result[2]*/ };
        result = ARGUMENT_NAMES.exec(paramsStr);
    }
}

function isNativeType(type: Type) {
    return type === String || type === Number || type === Boolean || type === Date || 
        type === Array || type === Map
}
