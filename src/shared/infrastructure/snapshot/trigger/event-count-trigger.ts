import Trigger from "./trigger";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";
import Uuid from "../../../domain/value-object/uuid";
import DomainEvent from "../../../domain/bus/event/domain-event";

export default class EventCountTrigger implements Trigger {
  constructor(private count: number) {}

  shouldSnapshot(
    aggregate: VersionedAggregateRoot<Uuid>,
    eventStream: DomainEvent[]
  ): boolean {
    for (const domainEvent of eventStream) {
      if (0 === (domainEvent.version() + 1) % this.count) {
        return true;
      }
    }

    return false;
  }
}
