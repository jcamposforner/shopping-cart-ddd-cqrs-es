export default interface ApmTracer {
    startSpan(spanName: string): void;
    endSpan(spanName: string): void;
}
