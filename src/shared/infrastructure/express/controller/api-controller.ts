import QueryBus from "../../../domain/bus/query/query-bus";
import CommandBus from "../../../domain/bus/command/command-bus";
import ApiExceptionHttpStatusCodeMapping from "../exception/api-exception-http-status-code-mapping";
import HashMap from "../../../domain/collection/hash-map";

export default abstract class ApiController {
    protected constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        private readonly exceptionHandler: ApiExceptionHttpStatusCodeMapping
    ) {
        this.exceptions().forEach((statusCode: number, exceptionName: string): void => {
            exceptionHandler.register(exceptionName, statusCode);
        });
    }

    abstract exceptions(): HashMap<string, number>;
}