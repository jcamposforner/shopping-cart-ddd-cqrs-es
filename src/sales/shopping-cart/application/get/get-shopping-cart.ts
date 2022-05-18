import ShoppingCartRepository from "../../domain/shopping-cart-repository";
import ShoppingCart from "../../domain/shopping-cart";
import ShoppingCartId from "../../domain/shopping-cart-id";

export default class GetShoppingCart {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async get(id: string): Promise<ShoppingCart> {
    const shoppingCartId = new ShoppingCartId(id);

    return this.repository.search(shoppingCartId);
  }
}
