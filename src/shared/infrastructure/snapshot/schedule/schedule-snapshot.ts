import Uuid from "../../../domain/value-object/uuid";
import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";

export default class ScheduleSnapshot<T extends VersionedAggregateRoot<Uuid>> {
  constructor(private id: Uuid, private className: new () => T) {}
}
