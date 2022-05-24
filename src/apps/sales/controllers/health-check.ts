import {Controller, Get} from "../../../shared/infrastructure/express/controller/decorator/rest-controller";
import {Request, Response} from 'express';

@Controller('/')
export default class HealthCheck {
    @Get('health-check')
    run(req: Request, res: Response) {
        return res.send({
            status: 'ok'
        })
    }
}