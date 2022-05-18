import DomainEvent from "../../../shared/domain/bus/event/domain-event";

export default class ShoppingCartItemAdded extends DomainEvent {
  private readonly _id: string;
  private readonly _itemName: string;
  private readonly _itemPrice: number;
  private readonly _quantity: number;

  constructor(
    id: string,
    itemName: string,
    itemPrice: number,
    quantity: number,
    version?: number
  ) {
    super(version);

    this._id = id;
    this._itemName = itemName;
    this._itemPrice = itemPrice;
    this._quantity = quantity;
  }

  withVersion(version: number): DomainEvent {
    return new ShoppingCartItemAdded(
      this._id,
      this._itemName,
      this._itemPrice,
      this._quantity,
      version
    );
  }

  itemName(): string {
    return this._itemName;
  }

  itemPrice(): number {
    return this._itemPrice;
  }

  quantity(): number {
    return this._quantity;
  }

  eventName(): string {
    return "ShoppingCartItemAdded";
  }
}
