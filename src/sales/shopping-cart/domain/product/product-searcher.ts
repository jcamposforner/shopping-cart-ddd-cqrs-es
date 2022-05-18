import ProductId from "../../../product/domain/product-id";
import CartProduct from "./cart-product";

export default interface ProductSearcher {
    search(productId: ProductId): Promise<CartProduct>;
}