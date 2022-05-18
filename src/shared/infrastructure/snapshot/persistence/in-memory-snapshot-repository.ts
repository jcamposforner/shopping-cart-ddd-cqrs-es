import SnapshotRepository from "./snapshot-repository";
import Snapshot from "../snapshot";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";
import Uuid from "../../../domain/value-object/uuid";

export default class InMemorySnapshotRepository<
  Aggregate extends VersionedAggregateRoot<Uuid>
> implements SnapshotRepository<Aggregate> {
  private values: Map<string, Snapshot<Aggregate>> = new Map();

  async save(snapshot: Snapshot<Aggregate>): Promise<void> {
    this.values.set(
      snapshot
        .aggregate()
        .aggregateRootId()
        .value(),
      snapshot
    );
  }

  async search(id: string): Promise<Snapshot<Aggregate> | null> {
    if (!this.values.has(id)) {
      return null;
    }

    return this.values.get(id);
  }
}
