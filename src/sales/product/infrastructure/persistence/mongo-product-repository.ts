import ProductRepository from "../../domain/product-repository";
import Product from "../../domain/product";
import ProductId from "../../domain/product-id";
import MongoRepository from "../../../../shared/infrastructure/persistence/mongo/mongo-repository";

export default class MongoProductRepository extends MongoRepository<Product> implements ProductRepository {
    protected moduleName(): string {
        return "Product";
    }

    async search(id: ProductId): Promise<Product | null> {
        const collection = await this.collection();
        const results = await collection.find({ _id: id.value() }).toArray();

        if (1 > results.length) {
            return null;
        }

        const result = results[0];

        // @ts-ignore
        return this.deserializer.deserialize(JSON.stringify(result), Product);
    }

    async store(product: Product): Promise<void> {
        await this.persist(product)
    }
}