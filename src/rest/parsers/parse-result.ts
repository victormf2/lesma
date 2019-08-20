export class ParseError {
    static readonly InvalidFormat = new ParseError()
}
export type ParseResult<T> = T | ParseError;