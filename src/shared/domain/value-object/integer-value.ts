export default class IntegerValue {
    constructor(protected readonly number: number) {}

    value(): number {
        return this.number;
    }
}