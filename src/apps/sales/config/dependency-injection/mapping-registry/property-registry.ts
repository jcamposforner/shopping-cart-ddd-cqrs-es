import ShoppingCartItem from "../../../../../sales/shopping-cart/domain/shopping-cart-item";
import ShoppingCartId from "../../../../../sales/shopping-cart/domain/shopping-cart-id";
import ProductPrice from "../../../../../sales/product/domain/product-price";
import ProductStock from "../../../../../sales/product/domain/product-stock";
import ProductId from "../../../../../sales/product/domain/product-id";
import Uuid from "../../../../../shared/domain/value-object/uuid";

const propertyRegistry = new Map;

// ShoppingCart
propertyRegistry.set("ShoppingCartItem", ShoppingCartItem);
propertyRegistry.set("ShoppingCartId", ShoppingCartId);

// Product
propertyRegistry.set("ProductPrice", ProductPrice);
propertyRegistry.set("ProductStock", ProductStock);
propertyRegistry.set("ProductId", ProductId);

// Shared
propertyRegistry.set("Uuid", Uuid);

export {propertyRegistry}