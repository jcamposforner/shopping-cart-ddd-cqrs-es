import SnapshotRepository from "./snapshot-repository";
import Snapshot from "../snapshot";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";
import Uuid from "../../../domain/value-object/uuid";
import Redis from "ioredis";
import AggregateSerializer from "../../../domain/aggregate/serializer/aggregate-serializer";
import AggregateDeserializer from "../../../domain/aggregate/serializer/aggregate-deserializer";


export default class RedisSnapshotRepository<
  Aggregate extends VersionedAggregateRoot<Uuid>
> implements SnapshotRepository<Aggregate> {
  constructor(
      private readonly redis: Redis,
      private readonly deserializer: AggregateDeserializer,
      private readonly serializer: AggregateSerializer,
      private readonly aggregate: new () => Aggregate
  ) {}

  async save(snapshot: Snapshot<Aggregate>): Promise<void> {
    const aggregateId = snapshot.aggregate().aggregateRootId().value();

    await this.redis.set(`snapshot-${this.aggregate.name}-${aggregateId}`, JSON.stringify(this.serializer.serialize(snapshot.aggregate())));
  }

  async search(id: string): Promise<Snapshot<Aggregate> | null> {
    const snapshot = await this.redis.get(`snapshot-${this.aggregate.name}-${id}`);
    if (null === snapshot) {
      return null;
    }

    const aggregate: Aggregate = this.deserializer.deserialize<Aggregate>(snapshot, this.aggregate);

    return new Snapshot<Aggregate>(aggregate);
  }
}
