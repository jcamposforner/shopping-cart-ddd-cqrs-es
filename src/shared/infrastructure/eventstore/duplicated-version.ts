import DomainEvent from "../../domain/bus/event/domain-event";

export default class DuplicatedVersion extends Error {
  constructor(
    private _eventsToAppend: DomainEvent[],
    private _duplicatedVersion: number
  ) {
    super();
  }

  eventsToAppend(): DomainEvent[] {
    return this._eventsToAppend;
  }

  duplicatedVersion(): number {
    return this._duplicatedVersion;
  }
}
