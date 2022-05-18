export default class CommandNotRegistered extends Error {
    constructor(commandName: string) {
        super(`Command ${commandName} not registered`);
    }
}