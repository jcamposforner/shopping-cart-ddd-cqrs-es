import DomainEvent from "../bus/event/domain-event";
import Uuid from "../value-object/uuid";

export default abstract class AggregateRoot<Id extends Uuid> {
  private domainEvents: DomainEvent[] = [];

  constructor(protected id: Id) {}

  pullDomainEvents(): DomainEvent[] {
    const domainEvents = this.domainEvents;
    this.domainEvents = [];

    return domainEvents;
  }

  raise(domainEvent: DomainEvent): void {
    if (!this.domainEvents) {
      this.domainEvents = [];
    }

    this.domainEvents.push(domainEvent);
  }

  aggregateRootId(): Id {
    return this.id;
  }
}
