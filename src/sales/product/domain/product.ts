import AggregateRoot from "../../../shared/domain/aggregate/aggregate-root";
import ProductId from "./product-id";
import ProductStock from "./product-stock";
import ProductPrice from "./product-price";

export default class Product extends AggregateRoot<ProductId> {
    constructor(id: ProductId, private _stock: ProductStock, private _price: ProductPrice) {
        super(id);
    }

    stock(): ProductStock {
        return this._stock;
    }

    price(): ProductPrice {
        return this._price;
    }
}