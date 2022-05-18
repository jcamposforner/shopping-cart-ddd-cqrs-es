import ConflictResolver from "./conflict-resolver";
import DomainEvent from "../../../../domain/bus/event/domain-event";

export default class OrConflictResolver implements ConflictResolver {
  constructor(private resolvers: ConflictResolver[]) {}

  conflicts(
    conflictedDomainEvent: DomainEvent,
    appendDomainEvent: DomainEvent
  ): boolean {
    for (const resolver of this.resolvers) {
      if (!resolver.conflicts(conflictedDomainEvent, appendDomainEvent)) {
        return false;
      }
    }

    return true;
  }
}
