import {json, urlencoded} from 'body-parser';
import compress from 'compression';
import errorHandler from 'errorhandler';
import express, {Request, Response} from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';
import DomainError from "./shared/domain/exceptions/domain-error";
import AddItemToCart from "./sales/shopping-cart/application/add-item/add-item-to-cart";
import ShoppingCart from "./sales/shopping-cart/domain/shopping-cart";
import {MongoClient} from "mongodb";
import ShoppingCartId from "./sales/shopping-cart/domain/shopping-cart-id";
import ProductId from "./sales/product/domain/product-id";
import Product from "./sales/product/domain/product";
import ProductStock from "./sales/product/domain/product-stock";
import ProductPrice from "./sales/product/domain/product-price";
import {getService, initializeContainer} from "./apps/sales/config/dependency-injection/container";
import ShoppingCartRepository from "./sales/shopping-cart/domain/shopping-cart-repository";
import ProductRepository from "./sales/product/domain/product-repository";
import EventBus from "./shared/domain/bus/event/event-bus";
import HealthCheck from "./apps/sales/controllers/health-check";
import {RouteDefinition} from "./shared/infrastructure/express/controller/decorator/rest-controller";
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
        this.express.use(router);

        let _ = initializeContainer();
        registerRoutes(router);

        router.get('/', async (req, res, next) => {
            const shoppingCartRepository: ShoppingCartRepository = getService("ShoppingCartRepository")
            const productRepository: ProductRepository           = getService("ProductRepository");
            const addItemService: AddItemToCart                  = getService(AddItemToCart)

            const id = ShoppingCartId.random();
            const cart = ShoppingCart.create(id);
            await shoppingCartRepository.store(cart)

            const productId = ProductId.random();
            const product = new Product(productId, new ProductStock(10), new ProductPrice(50));

            await productRepository.store(product);
            await addItemService.add(id.value(), productId, 5);


            const eventBus: EventBus = getService("EventBus")
            await eventBus.publish(cart.pullDomainEvents());


            return res.send({
                status: 'ok'
            })
        })

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