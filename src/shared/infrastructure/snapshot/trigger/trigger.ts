import DomainEvent from "../../../domain/bus/event/domain-event";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";
import Uuid from "../../../domain/value-object/uuid";

export default interface Trigger {
  shouldSnapshot(
    aggregate: VersionedAggregateRoot<Uuid>,
    eventStream: DomainEvent[]
  ): boolean;
}
