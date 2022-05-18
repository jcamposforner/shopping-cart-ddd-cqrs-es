import ConflictResolver from "./conflict-resolver";
import DomainEvent from "../../../../domain/bus/event/domain-event";

export default class FixedConflictResolver implements ConflictResolver {
  constructor(private value: boolean) {}

  conflicts(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    conflictedDomainEvent: DomainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    appendDomainEvent: DomainEvent
  ): boolean {
    return this.value;
  }

  static allow(): FixedConflictResolver {
    return new this(false);
  }

  static deny(): FixedConflictResolver {
    return new this(true);
  }
}
