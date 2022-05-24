import {Agent, Span} from "elastic-apm-node";
import ApmTracer from "../apm-tracer";
import HashMap from "../../../domain/collection/hash-map";

export default class ElasticApmTracer implements ApmTracer {
    private spanMap: HashMap<string, Span> = new HashMap();
    constructor(private agent: Agent) {}

    startSpan(spanName: string): void {
        const span = this.agent.startSpan(spanName);
        this.spanMap.set(spanName, span);
    }

    endSpan(spanName: string): void {
        this.spanMap.get(spanName).end();
        this.spanMap.delete(spanName);
    }
}