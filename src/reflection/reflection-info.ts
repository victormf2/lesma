import { Type, AbstractConstructor } from "../_types";

export abstract class MemberInfo {
    abstract readonly name: string

    constructor(
        readonly decorators: readonly Decorator[]
    ) {
        for (let decorator of decorators) {
            decorator.member = this
        }
    }

    hasDecorator(decoratorType: Type) {
        return this.decorators.some(d => d instanceof decoratorType)
    }

    getDecorators<T extends Decorator>(decoratorType: AbstractConstructor): T[] {
        return this.decorators.filter(d => d instanceof decoratorType) as T[]
    }

    getDecorator<T extends Decorator>(decoratorType: AbstractConstructor): T {
        return this.getDecorators<T>(decoratorType)[0]
    }
}

export class TypeInfo extends MemberInfo {
    constructor(
        readonly type: Type,
        readonly ctor: ConstructorInfo,
        readonly methods: readonly MethodInfo[],
        decorators: Decorator[],
        readonly properties: readonly PropertyInfo[],
        readonly genericParameters?: readonly TypeInfo[],
    ) {
        super(decorators)
        for (let method of this.methods) {
            method.ownerType = this
        }
        for (let property of this.properties) {
            property.ownerType = this
        }
    }

    get name() {
        return this.type.name
    }
}

export class ConstructorInfo {
    constructor(
        readonly type: Type,
        readonly parameters: readonly ParameterInfo[]
    ) {
        for (let parameter of this.parameters) {
            parameter.ctor = this
        }
    }
}

export class MethodInfo extends MemberInfo {
    private _ownerType: TypeInfo
    constructor(
        readonly method: Function,
        readonly parameters: readonly ParameterInfo[],
        decorators: Decorator[],
    ) {
        super(decorators)
        for (let parameter of this.parameters) {
            parameter.method = this
        }
    }

    get name() {
        return this.method.name
    }

    public set ownerType(value: TypeInfo) {
        if (this._ownerType) {
            throw new Error("Can not change type.")
        }
        this._ownerType = value
    }

    public get ownerType(): TypeInfo {
        return this._ownerType
    }
}

export class ParameterInfo extends MemberInfo {
    private _method: MethodInfo
    private _ctor: ConstructorInfo
    constructor(
        readonly name: string,
        readonly type: TypeInfo,
        readonly index: number,
        readonly defaultValue: any,
        decorators: Decorator[],
    ) {
        super(decorators)
    }

    public set method(value: MethodInfo) {
        if (this._method || this._ctor) {
            throw new Error("Can not change method.")
        }
        this._method = value
    }

    public get method() {
        return this._method
    }

    public set ctor(value: ConstructorInfo) {
        if (this._method || this._ctor) {
            throw new Error("Can not change ctor.")
        }
        this._ctor = value
    }

    public get ctor() {
        return this._ctor
    }
}

export class PropertyInfo extends MemberInfo {
    private _ownerType: TypeInfo
    constructor(
        readonly name: string,
        readonly type: TypeInfo,
        decorators: Decorator[],
    ) {
        super(decorators)
    }

    public set ownerType(value: TypeInfo) {
        if (this._ownerType) {
            throw new Error("Can not change type.")
        }
        this._ownerType = value
    }

    public get ownerType(): TypeInfo {
        return this._ownerType
    }
}

export abstract class Decorator {
    //@ts-ignore
    private IS_DECORATOR = true
    private _member: MemberInfo

    public set member(value: MemberInfo) {
        if (this._member) {
            throw new Error("Can not set member.")
        }
        this._member = value
    }

    public get member() {
        return this._member
    }
}