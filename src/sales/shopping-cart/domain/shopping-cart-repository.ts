import ShoppingCart from "./shopping-cart";
import ShoppingCartId from "./shopping-cart-id";

export default interface ShoppingCartRepository {
  store(shoppingCart: ShoppingCart): Promise<void>;
  search(shoppingCartId: ShoppingCartId): Promise<ShoppingCart|null>;
}
