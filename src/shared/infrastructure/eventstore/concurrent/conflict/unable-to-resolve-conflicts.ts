import DomainEvent from "../../../../domain/bus/event/domain-event";

export default class UnableToResolveConflicts extends Error {
  constructor(private _domainEvent: DomainEvent) {
    super();
  }

  get domainEvent(): DomainEvent {
    return this._domainEvent;
  }
}
