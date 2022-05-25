import "reflect-metadata"

type METHOD = 'get' | 'post' | 'delete' | 'options' | 'put';

export interface RouteDefinition {
    path: string;
    requestMethod: 'get' | 'post' | 'delete' | 'options' | 'put';
    methodName: string;
}

export const Controller = (prefix: string = ''): ClassDecorator => {
    return (target: any) => {
        Reflect.defineMetadata('prefix', prefix, target);

        if (! Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target);
        }
    };
};

export const Get = (path: string): MethodDecorator => {
    return pushRoute(path, 'get');
};

export const Put = (path: string): MethodDecorator => {
    return pushRoute(path, 'put');
};

export const Post = (path: string): MethodDecorator => {
    return pushRoute(path, 'post');
};

export const Delete = (path: string): MethodDecorator => {
    return pushRoute(path, 'delete');
};

function pushRoute(path: string, requestMethod: METHOD): MethodDecorator {
    return (target: object, propertyKey: string): void => {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

        routes.push({
            requestMethod,
            path,
            methodName: propertyKey
        });
        Reflect.defineMetadata('routes', routes, target.constructor);
    }
}