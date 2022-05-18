import IntegerValue from "./integer-value";
import InvalidArgument from "../exceptions/invalid-argument";

export default class PositiveInteger extends IntegerValue{
    constructor(protected readonly number: number) {
        super(number)
        if (1 > number) {
            throw new InvalidArgument(number);
        }
    }
}