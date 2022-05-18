export default class ImmutableList<T> implements Iterable<T> {
    constructor(private readonly values: T[]) {}

    filter(fn: (value: T, index: number, array: T[]) => value is T): ImmutableList<T> {
        return new ImmutableList(this.values.filter(fn));
    }

    [Symbol.iterator](): Iterator<T> {
        return this.values.values();
    }
}