import {addService, getService} from "../container";
import continuation from "continuation-local-storage";
import CustomerContext from "../../../../../shared/infrastructure/express/request-context/customer-context";
import {Request, Response} from "express";
import RequestContext from "../../../../../shared/infrastructure/express/request-context/request-context";

const session = continuation.createNamespace("session");
export const registerContexts = (): void => {
    addService(new CustomerContext(), CustomerContext);
    addService(
        (req: Request, res: Response, next: Function): void => {
            session.run(() => {
                session.set('CustomerContext', new CustomerContext());
                session.set('RequestContext', new RequestContext(req, Date.now()));
                next()
            })
        },
        "RequestsContexts"
    )
}

export const getContext = <T>(contextName: string): T => {
    return session.get(contextName);
}