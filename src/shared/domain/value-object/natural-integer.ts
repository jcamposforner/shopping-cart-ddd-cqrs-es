import IntegerValue from "./integer-value";
import InvalidArgument from "../exceptions/invalid-argument";

export default class NaturalInteger extends IntegerValue {
    constructor(protected readonly number: number) {
        super(number)
        if (0 > number) {
            throw new InvalidArgument(number);
        }
    }
}