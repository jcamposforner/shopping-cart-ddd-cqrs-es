import {json, urlencoded} from 'body-parser';
import compress from 'compression';
import errorHandler from 'errorhandler';
import express, {Request, Response} from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';
import DomainError from "./shared/domain/exceptions/domain-error";
import {MongoClient} from "mongodb";
import {getService, initializeContainer} from "./apps/sales/config/dependency-injection/container";
import {registerRoutes} from "./apps/sales/routes";

export class Server {
    private express: express.Express;
    private httpServer?: http.Server;
    private readonly port: string;

    constructor(port: string) {
        let mongoClient: MongoClient;
        new MongoClient("mongodb://mongodb").connect().then(client => {

            mongoClient = client;
        });

        this.port = port;
        this.express = express();
        this.express.use(json());
        this.express.use(urlencoded({ extended: true }));
        this.express.use(helmet.xssFilter());
        this.express.use(helmet.noSniff());
        this.express.use(helmet.hidePoweredBy());
        this.express.use(helmet.frameguard({ action: 'deny' }));
        this.express.use(compress());
        const router = Router();
        router.use(errorHandler());

        this.express.disable('etag');

        initializeContainer().then(() => {
            this.express.use(getService('RequestsContexts'));
            this.express.use(router);

            registerRoutes(router);

            router.use((err: Error, req: Request, res: Response, next: Function) => {
                if (err instanceof DomainError) {
                    return res.status(500).send({
                        code: err.errorCode(),
                        message: err.errorMessage(),
                    });
                }

                return res.status(500).send({
                    code: "internal_server_error",
                    message: err.message,
                    trace: err.stack
                });
            });
        });
    }

    async listen(): Promise<void> {
        return new Promise(resolve => {
            this.httpServer = this.express.listen(this.port, () => {
                console.log(
                    `  App is running at http://localhost:${this.port} in ${this.express.get('env')} mode`
                );
                console.log('  Press CTRL-C to stop\n');
                resolve();
            });
        });
    }

    getHTTPServer() {
        return this.httpServer;
    }

    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close(error => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            }

            return resolve();
        });
    }
}