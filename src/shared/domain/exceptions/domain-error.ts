export default abstract class DomainError extends Error {
    protected constructor() {
        super();
        this.message = this.errorMessage();
    }

    public abstract errorCode(): string;
    public abstract errorMessage(): string;
}