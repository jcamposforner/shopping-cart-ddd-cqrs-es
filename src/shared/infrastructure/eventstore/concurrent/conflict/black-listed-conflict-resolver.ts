import ConflictResolver from "./conflict-resolver";
import DomainEvent from "../../../../domain/bus/event/domain-event";

export default class BlackListedConflictResolver implements ConflictResolver {
  constructor(private domainEventName: string) {}

  conflicts(
    conflictedDomainEvent: DomainEvent,
    appendDomainEvent: DomainEvent
  ): boolean {
    return appendDomainEvent.constructor.name === this.domainEventName;
  }
}
