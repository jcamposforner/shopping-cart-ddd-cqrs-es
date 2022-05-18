export default class InvalidArgument<T> extends Error {
  constructor(private _value: T) {
    super(`Value ${_value} is an invalid argument`);
  }

  value(): T {
    return this._value;
  }
}
