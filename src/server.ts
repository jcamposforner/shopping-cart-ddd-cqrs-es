import {json, urlencoded} from 'body-parser';
import compress from 'compression';
import errorHandler from 'errorhandler';
import express, {Request, Response} from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';
import DomainError from "./shared/domain/exceptions/domain-error";
import AddItemToCart from "./sales/shopping-cart/application/add-item/add-item-to-cart";
import Redis from "ioredis";
import RedisEventStore from "./shared/infrastructure/eventstore/redis/redis-event-store";
import EventSourcingShoppingCartRepository
    from "./sales/shopping-cart/infrastructure/persistence/event-sourcing/event-sourcing-shopping-cart-repository";
import PrototypeVersionedAggregateFactory
    from "./shared/domain/aggregate/factory/prototype-versioned-aggregate-factory";
import ShoppingCart from "./sales/shopping-cart/domain/shopping-cart";
import BusProductSearcher from "./sales/shopping-cart/infrastructure/acl/BusProductSearcher";
import ProductSearcher from "./sales/product/application/search/product-searcher";
import MongoProductRepository from "./sales/product/infrastructure/persistence/mongo-product-repository";
import {MongoClient} from "mongodb";
import ShoppingCartCreated from "./sales/shopping-cart/domain/shopping-cart-created";
import ShoppingCartItemAdded from "./sales/shopping-cart/domain/shopping-cart-item-added";
import DefaultAggregateDeserializer from "./shared/domain/aggregate/serializer/default-aggregate-deserializer";
import DefaultAggregateSerializer from "./shared/domain/aggregate/serializer/default-aggregate-serializer";
import ShoppingCartItem from "./sales/shopping-cart/domain/shopping-cart-item";
import ShoppingCartId from "./sales/shopping-cart/domain/shopping-cart-id";
import ProductId from "./sales/product/domain/product-id";
import Product from "./sales/product/domain/product";
import ProductStock from "./sales/product/domain/product-stock";
import ProductPrice from "./sales/product/domain/product-price";
import Uuid from "./shared/domain/value-object/uuid";
import InMemoryEventBus from "./shared/infrastructure/bus/event/in-memory-event-bus";
import {DomainEventSubscriberMappings} from "./shared/domain/bus/event/domain-event-subscriber";
import WithApmTracerEventBus from "./shared/infrastructure/bus/event/apm/with-apm-tracer-event-bus";
import {getService, initializeContainer} from "./apps/sales/dependency-injection/container";
import ApmTracer from "./shared/infrastructure/apm/apm-tracer";
import DomainEvent from "./shared/domain/bus/event/domain-event";
import ShoppingCartRepository from "./sales/shopping-cart/domain/shopping-cart-repository";
import ProductRepository from "./sales/product/domain/product-repository";
import EventBus from "./shared/domain/bus/event/event-bus";

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

        router.get('/', async (req, res, next) => {
            const shoppingCartRepository: ShoppingCartRepository = getService("ShoppingCartRepository")
            const productRepository: ProductRepository = getService("ProductRepository");
            const addItemService = new AddItemToCart(
                shoppingCartRepository,
                new BusProductSearcher(
                    new ProductSearcher(
                        productRepository
                    )
                )
            );

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