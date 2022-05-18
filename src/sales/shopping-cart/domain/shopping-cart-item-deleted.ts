import DomainEvent from "../../../shared/domain/bus/event/domain-event";

export default class ShoppingCartItemDeleted extends DomainEvent {
  private readonly _id: string;
  private readonly _itemName: string;

  constructor(id: string, itemName: string, version?: number) {
    super(version);

    this._id = id;
    this._itemName = itemName;
  }

  withVersion(version: number): DomainEvent {
    return new ShoppingCartItemDeleted(this._id, this._itemName, version);
  }

  itemName(): string {
    return this._itemName;
  }

  eventName(): string {
    return "ShoppingCartItemDeleted";
  }
}
