import EventBus from "../../../../domain/bus/event/event-bus";
import DomainEvent from "../../../../domain/bus/event/domain-event";
import ApmTracer from "../../../apm/apm-tracer";

export default class WithApmTracerEventBus implements EventBus {
    constructor(
        private readonly eventBus: EventBus,
        private readonly tracer: ApmTracer
    ) {}

    async publish(domainEvents: DomainEvent[]): Promise<void> {
        const spanName = this.eventBus.constructor.name;
        this.tracer.startSpan(spanName);
        this.eventBus.publish(domainEvents);
        this.tracer.endSpan(spanName);
    }
}