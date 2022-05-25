import {Request, Response, Router } from 'express';
import HealthCheckController from "../controllers/health-check-controller";
import {RouteDefinition} from "../../../shared/infrastructure/express/controller/decorator/rest-controller";
import glob from 'glob';
import {container, getService} from "../config/dependency-injection/container";

export function registerRoutes(router: Router): void {
    const routes = glob.sync(__dirname + '/../controllers/**/*');

    routes.map(route => controller(route))
          .forEach((controller: Object) => pushRoute(controller, router));
}

function controller(route: string): Object {
    const routeClass = require(route);

    return routeClass.default;
}

function pushRoute(controller: Object, router: Router): void {
    // @ts-ignore
    const instance                       = getService(controller);
    const prefix                         = Reflect.getMetadata('prefix', controller);
    const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

    routes.forEach(route => {
        router[route.requestMethod](prefix + route.path, (req: Request, res: Response) => {
            // @ts-ignore
            instance[route.methodName](req, res);
        });
    });
}