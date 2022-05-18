import EventSourcingRepository from "../../../../../shared/infrastructure/eventsourcing/persistence/event-sourcing-repository";
import ShoppingCart from "../../../domain/shopping-cart";
import ShoppingCartRepository from "../../../domain/shopping-cart-repository";
import ShoppingCartId from "../../../domain/shopping-cart-id";

export default class EventSourcingShoppingCartRepository
  extends EventSourcingRepository<ShoppingCartId, ShoppingCart>
  implements ShoppingCartRepository {}
