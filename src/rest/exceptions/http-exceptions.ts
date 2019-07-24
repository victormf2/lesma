export class HttpException {

    readonly isHttpException = true;
    constructor(
        readonly statusCode: number,
        readonly message: string,
    ) {

    }

    public static isHttpException(value: any): value is HttpException {
        return value && value.isHttpException;
    }
}

export class BadRequestException extends HttpException {
    constructor(
        message = "Bad Request"
    ) {
        super(400, message);
    }
}

export class NotFoundException extends HttpException {
    constructor(
        message = "Not Found"
    ) {
        super(404, message);
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(
        message = "Internal Server Error"
    ) {
        super(500, message);
    }
}