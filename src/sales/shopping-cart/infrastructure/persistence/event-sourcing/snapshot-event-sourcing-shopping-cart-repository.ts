import ShoppingCart from "../../../domain/shopping-cart";
import ShoppingCartRepository from "../../../domain/shopping-cart-repository";
import ShoppingCartId from "../../../domain/shopping-cart-id";
import SnapshotEventSourcingRepository from "../../../../../shared/infrastructure/eventsourcing/persistence/snapshot-event-sourcing-repository";

export default class SnapshotEventSourcingShoppingCartRepository
  extends SnapshotEventSourcingRepository<ShoppingCartId, ShoppingCart>
  implements ShoppingCartRepository {}
