import DomainEvent from "../../domain/bus/event/domain-event";

export default interface EventStore {
  load(id: string): Promise<DomainEvent[]>;
  loadFromVersion(id: string, version: number): Promise<DomainEvent[]>;
  loadTillVersion(id: string, version: number): Promise<DomainEvent[]>;
  append(id: string, eventStream: DomainEvent[]): Promise<void>;
}
