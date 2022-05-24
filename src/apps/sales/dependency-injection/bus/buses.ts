import InMemoryCommandBus from "../../../../shared/infrastructure/bus/command/in-memory-command-bus";
import {commandHandlers} from "../../../../shared/domain/bus/command/handles";
import {addService, getService} from "../container";
import {eventHandlers} from "../../../../shared/domain/bus/event/domain-event-subscriber";
import InMemoryEventBus from "../../../../shared/infrastructure/bus/event/in-memory-event-bus";
import WithApmTracerEventBus from "../../../../shared/infrastructure/bus/event/apm/with-apm-tracer-event-bus";

export const registerBuses = (): void => {
    // Command buses
    addService(new InMemoryCommandBus(commandHandlers), InMemoryCommandBus);
    addService(getService(InMemoryCommandBus), "CommandBus");

    // Query buses

    // Event buses
    addService(new InMemoryEventBus(eventHandlers), InMemoryEventBus);
    addService(new WithApmTracerEventBus(
        getService(InMemoryEventBus),
        getService("ApmTracer")
    ), "EventBus");
}