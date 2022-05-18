import Uuid from "../../value-object/uuid";
import VersionedAggregateRoot from "../versioned-aggregate-root";

export default interface AggregateDeserializer {
    deserialize<Aggregate extends VersionedAggregateRoot<Uuid>>(serialized: string, aggregate: new () => Aggregate): Aggregate;
}