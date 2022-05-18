import ProductSearcherService from "../../domain/product/product-searcher";
import ProductSearcher from "../../../product/application/search/product-searcher";
import CartProduct from "../../domain/product/cart-product";
import ProductId from "../../../product/domain/product-id";

export default class BusProductSearcher implements ProductSearcherService {
    constructor(private readonly searcher: ProductSearcher) {}

    async search(productId: ProductId): Promise<CartProduct> {
        const product = await this.searcher.search(productId);

        return new CartProduct(productId, product.stock().value(), product.price().value());
    }

}