export default abstract class DomainEvent {
  protected constructor(private _version: number) {}

  version(): number {
    return this._version;
  }

  abstract withVersion(version: number): DomainEvent;
  abstract eventName(): string;
}
