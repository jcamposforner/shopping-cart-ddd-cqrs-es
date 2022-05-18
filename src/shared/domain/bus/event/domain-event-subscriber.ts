class DomainEventSubscriberMapping {
    constructor(private readonly _method: string, private readonly _subscriber: DomainEventSubscriber) {
    }

    method(): string {
        return this._method;
    }

    subscriber(): DomainEventSubscriber {
        return this._subscriber;
    }
}

class DomainEventSubscriberMappings {
    private map: Map<string, DomainEventSubscriberMapping[]> = new Map;

    add(eventName: string, mapping: DomainEventSubscriberMapping): DomainEventSubscriberMappings {
        let currentMapping: DomainEventSubscriberMapping[] = [];
        if (this.map.has(eventName)) {
            currentMapping = this.map.get(eventName);
        }

        this.map.set(eventName, [...currentMapping, mapping])
        return this;
    }

    for(eventName: string): DomainEventSubscriberMapping[] {
        const subscribersToAllEvents = this.map.get('*') ?? [];
        const subscribersToCurrentEvent = this.map.get(eventName) ?? [];
        const mergedSubscribers = [...subscribersToAllEvents, ...subscribersToCurrentEvent];

        return mergedSubscribers
            .filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });
    }
}

const eventHandlers: DomainEventSubscriberMappings = new DomainEventSubscriberMappings();

interface DomainEventSubscriber {
}

function DomainEventHandler(eventName: string): Function {
    return function (constructor: DomainEventSubscriber, method: string) {
        eventHandlers.add(eventName, new DomainEventSubscriberMapping(method, constructor));
    }
}

export {DomainEventHandler, DomainEventSubscriber, eventHandlers, DomainEventSubscriberMappings};