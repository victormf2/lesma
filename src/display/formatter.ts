import { FormatSpecifier } from "./format-specifier";

export interface IFormatter {
    format(value: any, format: FormatSpecifier): string;
}