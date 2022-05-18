import ProductRepository from "../../domain/product-repository";
import ProductId from "../../domain/product-id";
import Product from "../../domain/product";
import ProductNotExist from "../../domain/product-not-exist";

export default class ProductSearcher {
    constructor(private readonly repository: ProductRepository) {}

    async search(id: ProductId): Promise<Product> {
        const product = await this.repository.search(id);
        if (null === product) {
            throw new ProductNotExist(id.value());
        }

        return product;
    }
}