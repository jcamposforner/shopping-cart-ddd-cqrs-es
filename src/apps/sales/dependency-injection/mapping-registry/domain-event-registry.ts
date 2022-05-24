import ShoppingCartCreated from "../../../../sales/shopping-cart/domain/shopping-cart-created";
import ShoppingCartItemAdded from "../../../../sales/shopping-cart/domain/shopping-cart-item-added";
import ShoppingCartItemDeleted from "../../../../sales/shopping-cart/domain/shopping-cart-item-deleted";
import ShoppingCartItemQuantityAdjusted
    from "../../../../sales/shopping-cart/domain/shopping-cart-item-quantity-adjusted";

const domainEventsRegistry = new Map;

// Shopping Cart
domainEventsRegistry.set("ShoppingCartCreated", ShoppingCartCreated);
domainEventsRegistry.set("ShoppingCartItemAdded", ShoppingCartItemAdded);
domainEventsRegistry.set("ShoppingCartItemDeleted", ShoppingCartItemDeleted);
domainEventsRegistry.set("ShoppingCartItemQuantityAdjusted", ShoppingCartItemQuantityAdjusted);

export {domainEventsRegistry}