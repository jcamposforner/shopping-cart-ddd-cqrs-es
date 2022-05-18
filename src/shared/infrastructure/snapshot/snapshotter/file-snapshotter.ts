import VersionedAggregateRoot from "../../../domain/aggregate/versioned-aggregate-root";
import Uuid from "../../../domain/value-object/uuid";
import Snapshotter from "./snapshotter";
import fs from "fs";

export default class FileSnapshotter<
  Aggregate extends VersionedAggregateRoot<Uuid>
> implements Snapshotter {
  constructor(private filePath: string) {}

  async take(aggregate: VersionedAggregateRoot<Uuid>): Promise<void> {
    const content = JSON.parse(
      (await fs.readFileSync(this.filePath).toString()) || "{}"
    );

    const id = aggregate.aggregateRootId().value();
    content[id] = {
      id,
      className: aggregate.constructor.name
    };
    fs.writeFile(this.filePath, JSON.stringify(content), err =>
      console.log(err)
    );
  }
}
