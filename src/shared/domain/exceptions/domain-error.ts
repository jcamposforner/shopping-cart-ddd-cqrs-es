export default abstract class DomainError extends Error {
    constructor() {
        super();
        this.message = this.errorMessage();
    }

    abstract errorCode(): string;
    abstract errorMessage(): string;
}