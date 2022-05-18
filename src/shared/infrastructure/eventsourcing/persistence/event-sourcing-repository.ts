import EventStore from "../../eventstore/event-store";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";
import Uuid from "../../../domain/value-object/uuid";
import VersionedAggregateFactory from "../../../domain/aggregate/factory/versioned-aggregate-factory";

export default abstract class EventSourcingRepository<
  Id extends Uuid,
  Aggregate extends VersionedAggregateRoot<Id>
> {
  constructor(
    protected eventStore: EventStore,
    protected factory: VersionedAggregateFactory<Aggregate>
  ) {}

  async store(aggregateRoot: Aggregate): Promise<void> {
    await this.eventStore.append(
      aggregateRoot.aggregateRootId().value(),
      aggregateRoot.pullDomainEvents()
    );
  }

  async tillVersion(id: Id, version: number): Promise<Aggregate> {
    const events = await this.eventStore.loadTillVersion(id.value(), version);

    return this.factory.create(events);
  }

  async search(id: Id): Promise<Aggregate|null> {
    const events = await this.eventStore.load(id.value());
    if (events.length === 0) {
      return null;
    }

    return this.factory.create(events);
  }
}
