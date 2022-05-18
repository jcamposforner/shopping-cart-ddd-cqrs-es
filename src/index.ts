import InMemoryCommandBus from "./shared/infrastructure/bus/command/in-memory-command-bus";
import AddItemCommand from "./sales/shopping-cart/application/add-item/add-item-command";
import AddItemCommandHandler from "./sales/shopping-cart/application/add-item/add-item-command-handler";
import app from "./app";
import {commandHandlers} from "./shared/domain/bus/command/handles";
import ShoppingCart from "./sales/shopping-cart/domain/shopping-cart";
import ShoppingCartId from "./sales/shopping-cart/domain/shopping-cart-id";
import ConcurrentEventStore from "./shared/infrastructure/eventstore/concurrent/concurrent-event-store";
import RedisEventStore from "./shared/infrastructure/eventstore/redis/redis-event-store";
import FixedConflictResolver from "./shared/infrastructure/eventstore/concurrent/conflict/fixed-conflict-resolver";
import SnapshotEventSourcingShoppingCartRepository
    from "./sales/shopping-cart/infrastructure/persistence/event-sourcing/snapshot-event-sourcing-shopping-cart-repository";
import EventSourcingShoppingCartRepository
    from "./sales/shopping-cart/infrastructure/persistence/event-sourcing/event-sourcing-shopping-cart-repository";
import PrototypeVersionedAggregateFactory
    from "./shared/domain/aggregate/factory/prototype-versioned-aggregate-factory";
import RedisSnapshotRepository from "./shared/infrastructure/snapshot/persistence/redis-snapshot-repository";
import DefaultAggregateDeserializer from "./shared/domain/aggregate/serializer/default-aggregate-deserializer";
import InMemorySnapshotRepository from "./shared/infrastructure/snapshot/persistence/in-memory-snapshot-repository";
import EventCountTrigger from "./shared/infrastructure/snapshot/trigger/event-count-trigger";
import SynchronousSnapshotter from "./shared/infrastructure/snapshot/snapshotter/synchronous-snapshotter";
import Redis from 'ioredis';
import ShoppingCartCreated from "./sales/shopping-cart/domain/shopping-cart-created";
import ShoppingCartItemAdded from "./sales/shopping-cart/domain/shopping-cart-item-added";
import {eventHandlers} from "./shared/domain/bus/event/domain-event-subscriber";
import InMemoryEventBus from "./shared/infrastructure/bus/event/in-memory-event-bus";

const PORT = process.env.PORT || 8080;

const commandBus = new InMemoryCommandBus(new Map);

commandHandlers.forEach((commandHandler, commandName: string) => {
    commandBus.registry(commandName, commandHandler)
});

const redis = new Redis("cache");
const domainEventMap = new Map;
domainEventMap.set("ShoppingCartCreated", ShoppingCartCreated);
domainEventMap.set("ShoppingCartItemAdded", ShoppingCartItemAdded);

const eventStore = new RedisEventStore(redis, domainEventMap)
const concurrentEventStore = new ConcurrentEventStore(
    eventStore,
    new FixedConflictResolver(true)
)

// @ts-ignore
const eventSourcingShoppingCartRepository = new EventSourcingShoppingCartRepository(concurrentEventStore, new PrototypeVersionedAggregateFactory(ShoppingCart));

const inMemorySnapshotRepository = new InMemorySnapshotRepository<ShoppingCart>();
const repository = new SnapshotEventSourcingShoppingCartRepository(
    concurrentEventStore,
    eventSourcingShoppingCartRepository,
    inMemorySnapshotRepository,
    new EventCountTrigger(5),
    new SynchronousSnapshotter(inMemorySnapshotRepository)
)

const id = ShoppingCartId.random()
const cart = ShoppingCart.create(id);

cart.addItem("1", 1, 1);

repository.store(cart)

new AddItemCommandHandler();

const eventBus = new InMemoryEventBus(eventHandlers);

app.get('/', async function (req, res) {

    const cart = await repository.search(id);
    cart.addItem("2", 1, 1);
    await repository.store(cart);
    const cart2 = await repository.search(id);
    commandBus.dispatch(new AddItemCommand());

    eventBus.publishOnce(new ShoppingCartItemAdded(id.value(), "1", 1, 1, 1));


    res.send(cart2);
});

app.listen(PORT, () => {
    console.log("Server on port", PORT);
});