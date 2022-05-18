import CommandBus from "../../../domain/bus/command/command-bus";
import Command from "../../../domain/bus/command/command";
import CommandHandler from "../../../domain/bus/command/command-handler";
import CommandNotRegistered from "../../../domain/bus/command/command-not-registered";
import AddItemCommand from "../../../../sales/shopping-cart/application/add-item/add-item-command";

type Handler = CommandHandler<Command>;
type HandlerRegistry = Map<string, Handler>;

export default class InMemoryCommandBus<T extends Command> implements CommandBus<Command> {
    constructor(private handlersRegistry: HandlerRegistry) {}

    dispatch(command: Command): void {
        const commandName = command.constructor.name;
        if (!this.handlersRegistry.has(commandName)) {
            throw new CommandNotRegistered(commandName);
        }

        const handler = this.handlersRegistry.get(commandName);
        handler.handle(command);
    }

    registry(commandName: string, handler: Handler): void {
        handler.handle(new AddItemCommand())
        this.handlersRegistry.set(commandName, handler);
    }
}
