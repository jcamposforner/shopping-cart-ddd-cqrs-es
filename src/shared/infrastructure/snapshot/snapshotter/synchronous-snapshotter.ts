import Snapshotter from "./snapshotter";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";
import SnapshotRepository from "../persistence/snapshot-repository";
import Uuid from "../../../domain/value-object/uuid";
import Snapshot from "../snapshot";

export default class SynchronousSnapshotter<
  Aggregate extends VersionedAggregateRoot<Uuid>
> implements Snapshotter {
  constructor(private repository: SnapshotRepository<Aggregate>) {}

  async take(aggregate: Aggregate): Promise<void> {
    await this.repository.save(new Snapshot(aggregate));
  }
}
