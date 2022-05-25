import HealthCheckController from "../../../controllers/health-check-controller";
import {addService} from "../container";

export const registerControllers = (): void => {
    addService(new HealthCheckController(), HealthCheckController)
}