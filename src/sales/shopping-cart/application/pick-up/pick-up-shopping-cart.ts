import ShoppingCartRepository from "../../domain/shopping-cart-repository";
import ShoppingCart from "../../domain/shopping-cart";
import ShoppingCartId from "../../domain/shopping-cart-id";

export default class PickUpShoppingCart {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async pickup(): Promise<ShoppingCart> {
    const id = ShoppingCartId.random();
    const shoppingCart = ShoppingCart.create(id);

    await this.repository.store(shoppingCart);

    return shoppingCart;
  }
}
