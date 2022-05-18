import AggregateRoot from "../aggregate-root";
import Uuid from "../../value-object/uuid";

export default interface AggregateSerializer {
    serialize(aggregate: AggregateRoot<Uuid>): object;
}