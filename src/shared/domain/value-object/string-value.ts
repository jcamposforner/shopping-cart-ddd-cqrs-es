export default class StringValue {
    constructor(protected readonly _value: string) {}

    value(): string {
        return this._value;
    }
}