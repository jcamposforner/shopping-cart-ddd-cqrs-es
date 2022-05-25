import {Controller, Get} from "../../../shared/infrastructure/express/controller/decorator/rest-controller";
import {Request, Response} from 'express';
import RequestContext from "../../../shared/infrastructure/express/request-context/request-context";

@Controller('/')
export default class HealthCheckController {
    @Get('health-check')
    async run(req: Request, res: Response) {
        const requestContext = RequestContext.fromSession();

        return res.send({
            status: 'ok',
            requestId: requestContext.correlationId(),
            requestDate: requestContext.occurredOn(),
        })
    }
}
