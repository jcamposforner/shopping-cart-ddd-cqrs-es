import DomainEvent from "./domain-event";

export default interface EventBus {
    publish(domainEvents: DomainEvent[]): void;
}