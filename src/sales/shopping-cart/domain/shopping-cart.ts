import VersionedAggregateRoot from "../../../shared/domain/aggregate/versioned-aggregate-root";
import ShoppingCartId from "./shopping-cart-id";
import ShoppingCartCreated from "./shopping-cart-created";
import ShoppingCartItem from "./shopping-cart-item";
import ShoppingCartItemAdded from "./shopping-cart-item-added";
import ShoppingCartItemDeleted from "./shopping-cart-item-deleted";
import ShoppingCartItemQuantityAdjusted from "./shopping-cart-item-quantity-adjusted";

export default class ShoppingCart extends VersionedAggregateRoot<
  ShoppingCartId
> {
  private _items: ShoppingCartItem[] = [];

  constructor(id: ShoppingCartId) {
    super(id);
  }

  static create(id: ShoppingCartId): ShoppingCart {
    const shoppingCart = new ShoppingCart(id);
    shoppingCart.raise(new ShoppingCartCreated(id.value()));

    return shoppingCart;
  }

  protected applyShoppingCartCreated(domainEvent: ShoppingCartCreated): void {
    this.id = new ShoppingCartId(domainEvent.id());
    this._items = [];
  }

  addItem(name: string, price: number, quantity: number): void {
    this.raise(
      new ShoppingCartItemAdded(this.id.value(), name, price, quantity)
    );
  }

  protected applyShoppingCartItemAdded(
    domainEvent: ShoppingCartItemAdded
  ): void {
    const item = this.findItemByName(domainEvent.itemName());

    if (item) {
      item.add(domainEvent.quantity());
      return;
    }

    this._items.push(
      new ShoppingCartItem(
        domainEvent.itemName(),
        domainEvent.itemPrice(),
        domainEvent.quantity()
      )
    );
  }

  deleteItem(name: string): void {
    this.raise(new ShoppingCartItemDeleted(this.id.value(), name));
  }

  protected applyShoppingCartItemDeleted(
    domainEvent: ShoppingCartItemDeleted
  ): void {
    this._items = this._items.filter(
      (item: ShoppingCartItem) => item.name() !== domainEvent.itemName()
    );
  }

  adjustUnits(name: string, quantity: number): void {
    this.raise(
      new ShoppingCartItemQuantityAdjusted(this.id.value(), name, quantity)
    );
  }

  protected applyShoppingCartItemQuantityAdjusted(
    domainEvent: ShoppingCartItemQuantityAdjusted
  ): void {
    const item = this.findItemByName(domainEvent.name());

    if (item) {
      item.adjustQuantity(domainEvent.quantity());
    }
  }

  private findItemByName(name: string): ShoppingCartItem | null {
    return this._items.find((item: ShoppingCartItem) => item.name() === name);
  }

  total(): number {
    return this._items.reduce(
      (total: number, item: ShoppingCartItem) => total + item.price(),
      0
    );
  }

  items(): ShoppingCartItem[] {
    return this._items;
  }
}
