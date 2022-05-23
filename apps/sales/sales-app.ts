import {Server} from "../../src/server";

export default class SalesApp {
    server?: Server;

    async start(): Promise<void> {
        const port = process.env.PORT || '8080';
        this.server = new Server(port);
        return this.server.listen();
    }

    get httpServer() {
        return this.server?.getHTTPServer();
    }

    async stop() {
        return this.server?.stop();
    }
}