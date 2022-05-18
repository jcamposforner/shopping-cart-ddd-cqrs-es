import Snapshot from "../snapshot";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";
import Uuid from "../../../domain/value-object/uuid";

export default interface SnapshotRepository<
  Aggregate extends VersionedAggregateRoot<Uuid>
> {
  search(id: string): Promise<Snapshot<Aggregate> | null>;
  save(snapshot: Snapshot<Aggregate>): Promise<void>;
}
