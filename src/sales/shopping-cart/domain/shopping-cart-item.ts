export default class ShoppingCartItem {
  constructor(
    private _name: string,
    private _price: number,
    private _quantity: number
  ) {}

  name(): string {
    return this._name;
  }

  price(): number {
    return this.unitPrice() * this._quantity;
  }

  add(quantity: number): void {
    this._quantity += quantity;
  }

  unitPrice(): number {
    return this._price;
  }

  adjustQuantity(quantity: number): void {
    this._quantity = quantity;
  }
}
