import AggregateRoot from "./aggregate-root";
import Uuid from "../value-object/uuid";
import DomainEvent from "../bus/event/domain-event";

export default abstract class VersionedAggregateRoot<
  T extends Uuid
> extends AggregateRoot<T> {
  protected _aggregateVersion = -1;

  raise(domainEvent: DomainEvent): void {
    this.apply(domainEvent);

    ++this._aggregateVersion;
    super.raise(domainEvent.withVersion(this._aggregateVersion));
  }

  initializeState(domainEvents: DomainEvent[]): void {
    for (const domainEvent of domainEvents) {
      ++this._aggregateVersion;
      this.apply(domainEvent);
    }
  }

  aggregateVersion(): number {
    return this._aggregateVersion;
  }

  protected apply(domainEvent: DomainEvent): void {
    const methodName = `apply${domainEvent.constructor.name}`;

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (!this[methodName]) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this[methodName](domainEvent);
  }
}
