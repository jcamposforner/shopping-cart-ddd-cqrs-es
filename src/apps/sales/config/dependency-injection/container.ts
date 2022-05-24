// @ts-ignore

import {Container} from "inversify";
import {Newable} from "../../../../shared/domain/types/newable";
import {domainEventsRegistry} from "./mapping-registry/domain-event-registry";
import {propertyRegistry} from "./mapping-registry/property-registry";
import {registerRepositories} from "./persistence/repositories";
import {registerSerializers} from "./serializer/deserializers";
import {registerBuses} from "./bus/buses";
import {registerApplicationServices} from "./application/services";

const container = new Container({ autoBindInjectable: false });

type ServiceName<T> = string|Newable<T>;

const addService = <T>(service: T, serviceName?: ServiceName<T>): void => {
    container.bind<T>(serviceName ?? service.constructor.name).toConstantValue(service);
}

const getService = <T>(serviceName: ServiceName<T>): T => {
    return container.get(serviceName);
}

async function initializeContainer() {
    addService(domainEventsRegistry, "domainEventsRegistryMap");
    addService(propertyRegistry, "propertyRegistryMap");

    registerSerializers();
    registerBuses();
    await registerRepositories();
    registerApplicationServices();
}

export {container, getService, addService, initializeContainer};