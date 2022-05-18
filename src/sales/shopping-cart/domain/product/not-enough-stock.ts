import DomainError from "../../../../shared/domain/exceptions/domain-error";

export default class NotEnoughStock extends DomainError {
    constructor(private readonly totalStock: number) {
        super();
        this.message = this.errorMessage();
    }

    errorCode(): string {
        return "not_enough_stock";
    }

    errorMessage(): string {
        return `Product only has ${this.totalStock} stock`;
    }
}