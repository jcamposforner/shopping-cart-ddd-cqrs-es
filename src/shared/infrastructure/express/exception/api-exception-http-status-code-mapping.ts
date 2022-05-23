import HashMap from "../../../domain/collection/hash-map";
import InvalidArgument from "../../../domain/exceptions/invalid-argument";
import HTTPStatusCode from 'http-status-codes';

export default class ApiExceptionHttpStatusCodeMapping {
    private readonly DEFAULT_STATUS_CODE: number = HTTPStatusCode.INTERNAL_SERVER_ERROR;

    private exceptions: HashMap<string, number> = new HashMap();

    constructor() {
        this.register(InvalidArgument.name, HTTPStatusCode.BAD_REQUEST);
    }

    public register(exceptionClass: string, statusCode: number): void {
        this.exceptions.set(exceptionClass, statusCode)
    }

    public statusCodeFor(exceptionClass: string): number
    {
        return this.exceptions.getOrElse(exceptionClass, this.DEFAULT_STATUS_CODE);
    }
}