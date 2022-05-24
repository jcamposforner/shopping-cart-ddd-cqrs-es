import EventBus from "../../../domain/bus/event/event-bus";
import DomainEvent from "../../../domain/bus/event/domain-event";
import {DomainEventSubscriberMappings} from "../../../domain/bus/event/domain-event-subscriber";

export default class InMemoryEventBus implements EventBus {
    constructor(private eventMapping: DomainEventSubscriberMappings) {}

    publish(domainEvents: DomainEvent[]): void {
        for (const domainEvent of domainEvents) {
            this.publishOnce(domainEvent);
        }
    }

    publishOnce(domainEvent: DomainEvent): void {
        const subscribers = this.eventMapping.for(domainEvent.eventName());
        for (const subscriberMapping of subscribers) {
            const subscriber = subscriberMapping.subscriber();
            const method = subscriberMapping.method();
            // @ts-ignore
            if (!subscriber[method]) {
                return;
            }

            // @ts-ignore
            subscriber[method](domainEvent);
        }
    }
}