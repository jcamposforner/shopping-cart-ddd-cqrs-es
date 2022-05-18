import DomainEvent from "../../../../domain/bus/event/domain-event";

export default interface ConflictResolver {
  conflicts(
    conflictedDomainEvent: DomainEvent,
    appendDomainEvent: DomainEvent
  ): boolean;
}
