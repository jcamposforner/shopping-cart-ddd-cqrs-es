import AggregateRoot from "../aggregate-root";
import Uuid from "../../value-object/uuid";
import AggregateSerializer from "./aggregate-serializer";

export default class DefaultAggregateSerializer implements AggregateSerializer {
    serialize(aggregate: AggregateRoot<Uuid>): object {
        return this.serializeObject(aggregate);
    }

    private serializeObject(object: any): object {
        const propertyNames = Object.getOwnPropertyNames(object);
        let serializedItem = {
            __propertyType: object.constructor.name
        };

        for (const propertyName of propertyNames) {
            // @ts-ignore
            let property = object[propertyName];
            if (typeof property === 'object') {
                if (property.constructor.name !== 'Array') {
                    property.__propertyType = property.constructor.name;
                }

                if (Array.isArray(property)) {
                    property = property.map((item: any) => {
                        return { __propertyType: item.constructor.name, ...this.serializeObject(item)}
                    })
                }
            }

            serializedItem = {[propertyName]: property, ...serializedItem};
        }

        return serializedItem;
    }
}