import VersionedAggregateRoot from "../versioned-aggregate-root";
import Uuid from "../../value-object/uuid";
import DomainEvent from "../../bus/event/domain-event";

export default interface VersionedAggregateFactory<
  T extends VersionedAggregateRoot<Uuid>
> {
  create(domainEvents: DomainEvent[]): T;
}
