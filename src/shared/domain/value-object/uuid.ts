import { v4 as uuidv4, validate as validateUuid } from "uuid";
import InvalidArgument from "../exceptions/invalid-argument";

export default class Uuid {
  private readonly _value: string;

  constructor(value: string) {
    Uuid.ensureUuidIsValid(value);
    this._value = value;
  }

  static random(): Uuid {
    return new Uuid(uuidv4().toString());
  }

  value(): string {
    return this._value;
  }

  private static ensureUuidIsValid(value: string): void {
    if (!validateUuid(value)) {
      throw new InvalidArgument(value);
    }
  }
}
