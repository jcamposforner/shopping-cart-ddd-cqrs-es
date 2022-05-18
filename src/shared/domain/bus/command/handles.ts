import CommandHandler from "./command-handler";
import Command from "./command";

const commandHandlers: Map<string, CommandHandler<Command>> = new Map();

function Handles(commandName: string): Function {
    return function (constructor: CommandHandler<Command>) {
        commandHandlers.set(commandName, constructor);
    }
}

export { commandHandlers, Handles };