import DefaultAggregateDeserializer
    from "../../../../shared/domain/aggregate/serializer/default-aggregate-deserializer";
import {addService, getService} from "../container";
import DefaultAggregateSerializer from "../../../../shared/domain/aggregate/serializer/default-aggregate-serializer";
import AggregateDeserializer from "../../../../shared/domain/aggregate/serializer/aggregate-deserializer";

export const registerSerializers = (): void => {
    addService(new DefaultAggregateDeserializer(
        getService("propertyRegistryMap") as Map<string, new () => object>),
        DefaultAggregateDeserializer
    );
    addService(new DefaultAggregateSerializer(), DefaultAggregateSerializer)

    addService(getService(DefaultAggregateDeserializer), "AggregateDeserializer")
    addService(getService(DefaultAggregateSerializer), "AggregateSerializer")
}