import EventStore from "./event-store";
import DomainEvent from "../../domain/bus/event/domain-event";
import DuplicatedVersion from "./duplicated-version";

export default class InMemoryEventStore implements EventStore {
  private store: Map<string, Map<number, DomainEvent>> = new Map();

  async append(id: string, eventStream: DomainEvent[]): Promise<void> {
    if (undefined === this.store.get(id)) {
      this.store.set(id, new Map<number, DomainEvent>());
    }

    const storedEvents = this.store.get(id);
    InMemoryEventStore.assertStream(storedEvents, eventStream);

    for (const event of eventStream) {
      storedEvents.set(event.version(), event);
    }
  }

  load(id: string): Promise<DomainEvent[]> {
    if (!this.store.has(id)) {
      return Promise.resolve([]);
    }

    return Promise.resolve(this.domainEventsById(id));
  }

  loadFromVersion(id: string, version: number): Promise<DomainEvent[]> {
    if (!this.store.has(id)) {
      return Promise.resolve([]);
    }

    const storedEvents = this.domainEventsById(id);

    return Promise.resolve(
      storedEvents.filter((storedEvent: DomainEvent) => {
        return storedEvent.version() >= version;
      })
    );
  }

  loadTillVersion(id: string, version: number): Promise<DomainEvent[]> {
    if (!this.store.has(id)) {
      return Promise.resolve([]);
    }

    const storedEvents = this.domainEventsById(id);

    return Promise.resolve(
      storedEvents.filter((storedEvent: DomainEvent) => {
        return storedEvent.version() <= version;
      })
    );
  }

  private domainEventsById(id: string): DomainEvent[] {
    const storedEvents = this.store.get(id);

    return Array.from(storedEvents.values());
  }

  private static assertStream(
    storedEvents: Map<number, DomainEvent>,
    eventsToAppend: DomainEvent[]
  ): void {
    for (const eventToAppend of eventsToAppend) {
      const eventVersion = eventToAppend.version();
      if (storedEvents.has(eventVersion)) {
        throw new DuplicatedVersion(eventsToAppend, eventVersion);
      }
    }
  }
}
