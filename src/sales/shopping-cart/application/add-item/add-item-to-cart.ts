import ShoppingCartRepository from "../../domain/shopping-cart-repository";
import ShoppingCart from "../../domain/shopping-cart";
import ShoppingCartId from "../../domain/shopping-cart-id";
import ProductSearcher from "../../domain/product/product-searcher";
import ProductId from "../../../product/domain/product-id";
import NotEnoughStock from "../../domain/product/not-enough-stock";

export default class AddItemToCart {
  constructor(private readonly repository: ShoppingCartRepository, private readonly searcher: ProductSearcher) {}

  async add(
    id: string,
    productId: ProductId,
    quantity: number
  ): Promise<ShoppingCart> {
    const shoppingCartId = new ShoppingCartId(id);
    const shoppingCart = await this.repository.search(shoppingCartId);
    const product = await this.searcher.search(productId);

    if (quantity > product.stock) {
      throw new NotEnoughStock(product.stock);
    }

    shoppingCart.addItem(productId.value(), product.price, quantity);
    await this.repository.store(shoppingCart);

    return shoppingCart;
  }
}
