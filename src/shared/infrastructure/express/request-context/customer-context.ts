import {getContext} from "../../../../apps/sales/config/dependency-injection/request-context/request-context";

export default class CustomerContext {
    constructor(private _email?: string) {}

    static fromSession(): CustomerContext {
        return getContext('CustomerContext');
    }

    setEmail(email: string): void {
        this._email = email;
    }

    email(): string {
        return this._email;
    }
}