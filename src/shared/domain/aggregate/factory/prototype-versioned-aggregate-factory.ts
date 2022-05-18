import VersionedAggregateFactory from "./versioned-aggregate-factory";
import Uuid from "../../value-object/uuid";
import VersionedAggregateRoot from "../versioned-aggregate-root";
import DomainEvent from "../../bus/event/domain-event";

export default class PrototypeVersionedAggregateFactory<
  T extends VersionedAggregateRoot<Uuid>
> implements VersionedAggregateFactory<T> {
  constructor(private className: new () => T) {}

  create(domainEvents: DomainEvent[]): T {
    const prototypedClass = Object.create(this.className.prototype);
    prototypedClass._aggregateVersion = -1;
    prototypedClass.initializeState(domainEvents);

    return prototypedClass;
  }
}
