import ShoppingCart from "../../domain/shopping-cart";
import ShoppingCartRepository from "../../domain/shopping-cart-repository";
import ShoppingCartId from "../../domain/shopping-cart-id";

export default class RemoveItemFromCart {
  constructor(private readonly repository: ShoppingCartRepository) {}

  async remove(id: string, name: string): Promise<ShoppingCart> {
    const shoppingCartId = new ShoppingCartId(id);
    const shoppingCart = await this.repository.search(shoppingCartId);

    shoppingCart.deleteItem(name);
    await this.repository.store(shoppingCart);

    return shoppingCart;
  }
}
