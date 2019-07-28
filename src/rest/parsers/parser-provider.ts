import { TypeInfo } from "../../metadata";
import { IParser } from "./parser";

export abstract class ParserProvider {
    abstract get<T>(typeInfo: TypeInfo): IParser<T>
}