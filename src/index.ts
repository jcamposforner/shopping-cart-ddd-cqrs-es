const apm = require('elastic-apm-node').start({
    serviceName: 'sales',
    serverUrl: 'http://apm-server:8200',
});

import ElasticApmTracer from "./shared/infrastructure/apm/elastic/elastic-apm-tracer";
import SalesApp from "./apps/sales/sales-app";
import { addService } from "./apps/sales/config/dependency-injection/container";
import "reflect-metadata"

addService(new ElasticApmTracer(apm), "ApmTracer");

try {
    new SalesApp().start().catch(handleError)
} catch (e) {
    handleError(e);
}

process.on('uncaughtException', err => {
    console.log('uncaughtException', err);
    process.exit(1);
});

function handleError(e: any) {
    console.log(e);
    process.exit(1);
}
