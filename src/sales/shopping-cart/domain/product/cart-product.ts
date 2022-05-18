import ProductId from "../../../product/domain/product-id";

export default class CartProduct {
    constructor(public readonly id: ProductId, public readonly stock: number, public readonly price: number) {}
}