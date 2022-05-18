import EventStore from "../event-store";
import DomainEvent from "../../../domain/bus/event/domain-event";
import DuplicatedVersion from "../duplicated-version";
import ConflictResolver from "./conflict/conflict-resolver";
import UnableToResolveConflicts from "./conflict/unable-to-resolve-conflicts";

export default class ConcurrentEventStore implements EventStore {
  constructor(
    private eventStore: EventStore,
    private conflictResolver: ConflictResolver
  ) {}

  load(id: string): Promise<DomainEvent[]> {
    return this.eventStore.load(id);
  }

  loadFromVersion(id: string, version: number): Promise<DomainEvent[]> {
    return this.eventStore.loadFromVersion(id, version);
  }

  loadTillVersion(id: string, version: number): Promise<DomainEvent[]> {
    return this.eventStore.loadTillVersion(id, version);
  }

  async append(id: string, eventStream: DomainEvent[]): Promise<void> {
    try {
      await this.eventStore.append(id, eventStream);
    } catch (duplicatedVersion) {
      if (!(duplicatedVersion instanceof DuplicatedVersion)) {
        throw duplicatedVersion;
      }

      const resolvedStream = await this.resolveConflicts(id, eventStream);
      await this.append(id, resolvedStream);
    }
  }

  private async resolveConflicts(
    id: string,
    eventStream: DomainEvent[]
  ): Promise<DomainEvent[]> {
    const commitedEvents = await this.loadAggregateFromFirstConflictEvent(
      id,
      eventStream
    );

    const conflictingEvents = ConcurrentEventStore.conflictedEvents(
      commitedEvents,
      eventStream
    );

    let currentVersion = commitedEvents[commitedEvents.length - 1].version();
    const resolvedEvents = [];
    for (const domainEvent of eventStream) {
      this.ensureThereAreNoConflicts(domainEvent, conflictingEvents);
      ++currentVersion;

      resolvedEvents.push(domainEvent.withVersion(currentVersion));
    }

    return resolvedEvents;
  }

  private async loadAggregateFromFirstConflictEvent(
    id: string,
    eventStream: DomainEvent[]
  ): Promise<DomainEvent[]> {
    const uncommitedVersion = eventStream[0].version();

    return this.eventStore.loadFromVersion(id, uncommitedVersion);
  }

  private ensureThereAreNoConflicts(
    domainEvent: DomainEvent,
    conflictingEvents: DomainEvent[]
  ): void {
    for (const conflictingEvent of conflictingEvents) {
      if (this.conflictResolver.conflicts(conflictingEvent, domainEvent)) {
        throw new UnableToResolveConflicts(domainEvent);
      }
    }
  }

  private static conflictedEvents(
    commitedEvents: DomainEvent[],
    eventStream: DomainEvent[]
  ): DomainEvent[] {
    const conflictingEvents = [];
    for (const commitedEvent of commitedEvents) {
      for (const uncommitedEvent of eventStream) {
        if (commitedEvent.version() >= uncommitedEvent.version()) {
          conflictingEvents.push(commitedEvent);
          break;
        }
      }
    }

    return conflictingEvents;
  }
}
