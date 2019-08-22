import { IParser } from "./parser";
import { TypeInfo } from "../..";

export abstract class ParserProvider {
    abstract get<T>(typeInfo: TypeInfo): IParser<T>
}