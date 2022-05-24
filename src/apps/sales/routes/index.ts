import {Request, Response, Router } from 'express';
import HealthCheck from "../controllers/health-check";
import {RouteDefinition} from "../../../shared/infrastructure/express/controller/decorator/rest-controller";
import glob from 'glob';

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
    const instance                       = new controller();
    const prefix                         = Reflect.getMetadata('prefix', controller);
    const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

    routes.forEach(route => {
        router[route.requestMethod](prefix + route.path, (req: Request, res: Response) => {
            instance[route.methodName](req, res);
        });
    });
}