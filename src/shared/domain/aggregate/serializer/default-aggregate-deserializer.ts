import Uuid from "../../value-object/uuid";
import AggregateDeserializer from "./aggregate-deserializer";
import VersionedAggregateRoot from "../versioned-aggregate-root";

export default class DefaultAggregateDeserializer implements AggregateDeserializer {
    constructor(private readonly propertyRegistry: Map<string, new () => object>) {}

    deserialize<Aggregate extends VersionedAggregateRoot<Uuid>>(serialized: string, aggregate: new () => Aggregate): Aggregate {
        const object = JSON.parse(serialized);
        const aggregateDeserialized = this.deserializeObject(object);

        return Object.assign(Object.create(aggregate.prototype), aggregateDeserialized);
    }

    private deserializeObject(object: any): object {
        let deserializedItem = {};
        const propertyNames = Object.getOwnPropertyNames(object);

        for (const propertyName of propertyNames) {
            // @ts-ignore
            let property = object[propertyName];
            let propertyValue = property;

            if (typeof property === 'object') {
                if (property.constructor.name === 'Object' && undefined !== property.__propertyType && 'Array' !== property.__propertyType) {
                    const propertyObject = this.propertyRegistry.get(property.__propertyType);

                    propertyValue = Object.assign(Object.create(propertyObject.prototype), property);
                }

                if (Array.isArray(property)) {
                    propertyValue = property.map((item: any) => {
                        const propertyObject = this.propertyRegistry.get(item.__propertyType);
                        delete item.__propertyType;

                        return Object.assign(
                            Object.create(
                                propertyObject.prototype
                            ),
                            this.deserializeObject(item)
                        );
                    })
                }
            }

            deserializedItem = {[propertyName]: propertyValue, ...deserializedItem};
        }

        return deserializedItem;
    }
}
