import CommandHandler from "../../../../shared/domain/bus/command/command-handler";
import AddItemCommand from "./add-item-command";
import {Handles} from "../../../../shared/domain/bus/command/handles";

export default class AddItemCommandHandler implements CommandHandler<AddItemCommand> {
    @Handles(AddItemCommand.name)
    handle(command: AddItemCommand): void {
    }
}