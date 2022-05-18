import Uuid from "../../../domain/value-object/uuid";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";

export default interface Snapshotter {
  take(aggregate: VersionedAggregateRoot<Uuid>): Promise<void>;
}
