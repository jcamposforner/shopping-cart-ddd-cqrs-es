import Command from "./command";

export default interface CommandBus {
    dispatch<T extends Command>(command: T): void;
}