import {getContext} from "../../../../apps/sales/config/dependency-injection/request-context/request-context";
import {Request, Response} from "express";
import Uuid from "../../../domain/value-object/uuid";

export default class RequestContext {
    private readonly CORRELLATION_ID_HEADER = 'x-correlation-id';

    constructor(public request: Request, private readonly _occurredOn: number) {
        if (undefined === request.header(this.CORRELLATION_ID_HEADER)) {
            request.headers[this.CORRELLATION_ID_HEADER] = Uuid.random().value();
        }
    }

    correlationId(): string {
        return this.request.header(this.CORRELLATION_ID_HEADER);
    }

    static fromSession(): RequestContext {
        return getContext('RequestContext');
    }

    occurredOn(): number {
        return this._occurredOn;
    }
}