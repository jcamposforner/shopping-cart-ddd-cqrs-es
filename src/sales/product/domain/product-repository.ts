import Product from "./product";
import ProductId from "./product-id";

export default interface ProductRepository {
    search(id: ProductId): Promise<Product|null>;
    store(product: Product): Promise<void>;
}