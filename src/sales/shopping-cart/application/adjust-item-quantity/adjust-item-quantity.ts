import ShoppingCartRepository from "../../domain/shopping-cart-repository";
import ShoppingCart from "../../domain/shopping-cart";
import ShoppingCartId from "../../domain/shopping-cart-id";

export default class AdjustItemQuantity {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async adjustUnits(
    id: string,
    name: string,
    quantity: number
  ): Promise<ShoppingCart> {
    const shoppingCartId = new ShoppingCartId(id);
    const shoppingCart = await this.repository.search(shoppingCartId);

    shoppingCart.adjustUnits(name, quantity);
    await this.repository.store(shoppingCart);

    return shoppingCart;
  }
}
