import DomainEvent from "../../../shared/domain/bus/event/domain-event";

export default class ShoppingCartItemQuantityAdjusted extends DomainEvent {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _quantity: number;

  constructor(id: string, name: string, quantity: number, version?: number) {
    super(version);

    this._id = id;
    this._name = name;
    this._quantity = quantity;
  }

  withVersion(version: number): DomainEvent {
    return new ShoppingCartItemQuantityAdjusted(
      this._id,
      this._name,
      this._quantity,
      version
    );
  }

  id(): string {
    return this._id;
  }

  name(): string {
    return this._name;
  }

  quantity(): number {
    return this._quantity;
  }

  eventName(): string {
    return "ShoppingCartItemQuantityAdjusted";
  }
}
