import {addService, getService} from "../container";
import Redis from "ioredis";
import RedisEventStore from "../../../../../shared/infrastructure/eventstore/redis/redis-event-store";
import DomainEvent from "../../../../../shared/domain/bus/event/domain-event";
import EventSourcingShoppingCartRepository
    from "../../../../../sales/shopping-cart/infrastructure/persistence/event-sourcing/event-sourcing-shopping-cart-repository";
import PrototypeVersionedAggregateFactory
    from "../../../../../shared/domain/aggregate/factory/prototype-versioned-aggregate-factory";
import ShoppingCart from "../../../../../sales/shopping-cart/domain/shopping-cart";
import MongoProductRepository from "../../../../../sales/product/infrastructure/persistence/mongo-product-repository";
import {MongoClient} from "mongodb";
import ProductRepository from "../../../../../sales/product/domain/product-repository";

export const registerRepositories = async (): Promise<void> => {
    // Shopping Cart
    addService(new Redis("cache"), "ShoppingCartRedis");
    addService(
        new RedisEventStore(
            getService("ShoppingCartRedis"),
            getService("domainEventsRegistryMap") as Map<string, new () => DomainEvent>
        ),
        RedisEventStore
    );
    addService(
        new EventSourcingShoppingCartRepository(
            getService(RedisEventStore),
            // @ts-ignore
            new PrototypeVersionedAggregateFactory(ShoppingCart)
        ),
        "ShoppingCartRepository"
    );

    // Product
    addService(await new MongoClient("mongodb://mongodb").connect(), "ProductMongoClient");
    addService(
        new MongoProductRepository(
            getService("ProductMongoClient"),
            getService("AggregateDeserializer"),
            getService("AggregateSerializer")
        ),
        MongoProductRepository
    );
    addService(getService(MongoProductRepository), "ProductRepository")
}

