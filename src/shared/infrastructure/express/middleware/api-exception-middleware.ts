import Middleware from "./middleware";
import Express from 'express';

export default class ApiExceptionMiddleware implements Middleware {
    onRequest(req: Express.Request): void {
        console.log(req.url)
    }

    onException(req: Express.Request, res: Express.Response, err: Error): void {
        res.send({a: 1})
    }
}