import DomainEvent from "../../../shared/domain/bus/event/domain-event";

export default class ShoppingCartCreated extends DomainEvent {
  private readonly _id: string;

  constructor(id: string, version?: number) {
    super(version);

    this._id = id;
  }

  withVersion(version: number): DomainEvent {
    return new ShoppingCartCreated(this._id, version);
  }

  id(): string {
    return this._id;
  }

  eventName(): string {
    return "ShoppingCartCreated";
  }
}
