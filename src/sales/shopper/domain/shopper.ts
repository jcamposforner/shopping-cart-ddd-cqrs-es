import AggregateRoot from "../../../shared/domain/aggregate/aggregate-root";
import ShopperId from "./shopper-id";
import ShopperEmail from "./shopper-email";
import OrderId from "../../order/domain/order-id";

export default class Shopper extends AggregateRoot<ShopperId> {
    constructor(id: ShopperId, private email: ShopperEmail, private orders: OrderId[]) {
        super(id);
    }
}