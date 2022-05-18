import Command from "./command";

export default interface CommandBus<T extends Command> {
    dispatch(command: T): void;
}