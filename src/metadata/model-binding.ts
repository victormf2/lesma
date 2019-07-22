export abstract class ModelBindingMetadata {
    constructor(
        readonly target: ModelBindingTarget
    ) {}
}

export class ModelBindingTarget {
    constructor(
        readonly parameterIndex: number,
        readonly targetPath?: string // TODO parse path to build complex objects from model binding
    ) {
        
    }
}

export class QueryModelBinding extends ModelBindingMetadata {
    constructor(
        readonly name: string,
        target: ModelBindingTarget
    ) {
        super(target);
    }
}

export class PathModelBinding extends ModelBindingMetadata {
    constructor(
        readonly name: string,
        target: ModelBindingTarget
    ) {
        super(target);
    }
}

export class DefaultModelBinding extends ModelBindingMetadata {
    constructor(
        target: ModelBindingTarget
    ) {
        super(target);
    }
}