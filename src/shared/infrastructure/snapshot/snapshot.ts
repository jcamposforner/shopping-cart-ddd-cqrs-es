import VersionedAggregateRoot from "../../domain/aggregate/versioned-aggregate-root";
import Uuid from "../../domain/value-object/uuid";

export default class Snapshot<Aggregate extends VersionedAggregateRoot<Uuid>> {
  constructor(private _aggregate: Aggregate) {}

  aggregate(): Aggregate {
    return this._aggregate;
  }

  version(): number {
    return this.aggregate().aggregateVersion();
  }
}
