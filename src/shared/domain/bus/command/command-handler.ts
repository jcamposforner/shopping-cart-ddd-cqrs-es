import Command from "./command";

export default interface CommandHandler<T extends Command> {
    handle(command: T): void;
}