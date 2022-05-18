import EventStore from "../../eventstore/event-store";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";
import Uuid from "../../../domain/value-object/uuid";
import EventSourcingRepository from "./event-sourcing-repository";
import SnapshotRepository from "../../snapshot/persistence/snapshot-repository";
import Trigger from "../../snapshot/trigger/trigger";
import Snapshotter from "../../snapshot/snapshotter/snapshotter";

export default class SnapshotEventSourcingRepository<
  Id extends Uuid,
  Aggregate extends VersionedAggregateRoot<Id>
> {
  constructor(
    protected eventStore: EventStore,
    protected eventSourceRepository: EventSourcingRepository<Id, Aggregate>,
    protected snapshotRepository: SnapshotRepository<Aggregate>,
    protected trigger: Trigger,
    protected snapshotter: Snapshotter
  ) {}

  async store(aggregateRoot: Aggregate): Promise<void> {
    const eventStream = aggregateRoot.pullDomainEvents();
    await this.eventStore.append(
      aggregateRoot.aggregateRootId().value(),
      eventStream
    );

    if (this.trigger.shouldSnapshot(aggregateRoot, eventStream)) {
      await this.snapshotter.take(aggregateRoot);
    }
  }

  async tillVersion(id: Id, version: number): Promise<Aggregate> {
    return this.eventSourceRepository.tillVersion(id, version);
  }

  async search(id: Id): Promise<Aggregate> {
    const snapshot = await this.snapshotRepository.search(id.value());

    if (null === snapshot) {
      return this.eventSourceRepository.search(id);
    }

    const aggregate = snapshot.aggregate();
    const startVersion = snapshot.version() + 1;
    const domainEvents = await this.eventStore.loadFromVersion(
      id.value(),
      startVersion
    );
    aggregate.initializeState(domainEvents);

    return aggregate;
  }
}
