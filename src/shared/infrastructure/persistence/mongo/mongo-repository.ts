import AggregateRoot from "../../../domain/aggregate/aggregate-root";
import Uuid from "../../../domain/value-object/uuid";
import { Collection, MongoClient } from 'mongodb';
import AggregateSerializer from "../../../domain/aggregate/serializer/aggregate-serializer";
import AggregateDeserializer from "../../../domain/aggregate/serializer/aggregate-deserializer";

export default abstract class MongoRepository<Aggregate extends AggregateRoot<Uuid>> {
    constructor(protected readonly client: MongoClient, protected readonly deserializer: AggregateDeserializer, protected readonly serializer: AggregateSerializer) {}

    protected abstract moduleName(): string;

    protected async collection(): Promise<Collection> {
        return this.client.db().collection(this.moduleName());
    }

    protected async persist(aggregate: Aggregate): Promise<void> {
        const collection = await this.collection();
        const document = this.serializer.serialize(aggregate);

        await collection.updateOne({ _id: aggregate.aggregateRootId().value() }, { $set: document }, { upsert: true });
    }
}