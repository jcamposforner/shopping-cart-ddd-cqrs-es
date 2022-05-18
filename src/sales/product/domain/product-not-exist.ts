import DomainError from "../../../shared/domain/exceptions/domain-error";

export default class ProductNotExist extends DomainError {
    constructor(private readonly id: string) {
        super();
    }

    errorCode(): string {
        return "product_not_exist";
    }

    errorMessage(): string {
        return `Product ${this.id} not exist`;
    }

}