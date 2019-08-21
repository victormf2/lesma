import { ParserProvider } from "../parser-provider";
import { TypeInfo } from "../../../metadata";
import { Type } from "../../../_types";
import { IParser } from "../parser";
import { DefaultArrayParser } from ".";
import { DefaultBooleanParser } from "./boolean.parser";
import { DefaultComplexParser } from "./complex.parser";
import { DefaultDateParser } from "./date.parser";
import { DefaultNumberParser } from "./number.parser";
import { DefaultStringParser } from "./string.parser";
import { CaracolMetadata, Scope, Caracol } from "../../../caracol";

class DefaultParserProvider extends ParserProvider {
    private _parsers = new Map<Type, Type>();
    constructor(
        private caracol: Caracol<any>
    ) {
        super();
        this._parsers.set(Array, DefaultArrayParser);
        this._parsers.set(Boolean, DefaultBooleanParser);
        this._parsers.set(Object, DefaultComplexParser);
        this._parsers.set(Date, DefaultDateParser);
        this._parsers.set(Number, DefaultNumberParser);
        this._parsers.set(String, DefaultStringParser);
    }

    get<T>(typeInfo: TypeInfo): IParser<T> {
        const parserConstructor = this._parsers.get(typeInfo.type) || this._parsers.get(Object);
        return this.caracol.get(parserConstructor);
    }
}
CaracolMetadata.addDependency(ParserProvider, Scope.Context, (caracol) => new DefaultParserProvider(caracol));