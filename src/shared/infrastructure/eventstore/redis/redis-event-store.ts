import EventStore from "../event-store";
import DomainEvent from "../../../domain/bus/event/domain-event";
import Redis from "ioredis";
import DuplicatedVersion from "../duplicated-version";

export default class RedisEventStore implements EventStore {
  constructor(private readonly redis: Redis, private readonly domainEventsRegistry: Map<string, new () => DomainEvent>) {}

  async append(id: string, eventStream: DomainEvent[]): Promise<void> {
    const storedEvents = await this.searchById(id);
    RedisEventStore.assertStream(this.domainEventFactory(storedEvents), eventStream);
    for (const event of eventStream) {
      storedEvents.push({ _className: event.constructor.name, ...event });
    }

    this.redis.set(id, JSON.stringify(storedEvents))
  }

  private async searchById(id: string): Promise<any[]> {
    return JSON.parse(await this.redis.get(id)) ?? [];
  }

  async load(id: string): Promise<DomainEvent[]> {
    const eventStream = await this.searchById(id);

    return this.domainEventFactory(eventStream);
  }

  async loadFromVersion(id: string, version: number): Promise<DomainEvent[]> {
    const eventStream  = await this.searchById(id);
    const domainEvents = this.domainEventFactory(eventStream);

    return domainEvents.filter((domainEvent: DomainEvent) => domainEvent.version() >= version);
  }

  async loadTillVersion(id: string, version: number): Promise<DomainEvent[]> {
    const eventStream  = await this.searchById(id);
    const domainEvents = this.domainEventFactory(eventStream);

    return domainEvents.filter((domainEvent: DomainEvent) => domainEvent.version() <= version);
  }

  private domainEventFactory(eventStream: any[]): DomainEvent[] {
    if (null === eventStream) {
      return [];
    }

    const domainEvents: DomainEvent[] = [];
    for (const event of eventStream) {
      const domainEventClass = this.domainEventsRegistry.get(event._className);
      const prototypedDomainEvent = new domainEventClass();

      // @ts-ignore
      domainEvents.push(Object.assign(prototypedDomainEvent, event));
    }

    return domainEvents;
  }

  private static assertStream(
      storedEvents: DomainEvent[],
      eventsToAppend: DomainEvent[]
  ): void {
    let mapStoredEvents = new Map;
    for (const storedEvent of storedEvents) {
      mapStoredEvents.set(storedEvent.version(), storedEvent)
    }

    for (const eventToAppend of eventsToAppend) {
      const eventVersion = eventToAppend.version();
      if (mapStoredEvents.has(eventVersion)) {
        throw new DuplicatedVersion(eventsToAppend, eventVersion);
      }
    }
  }
}
