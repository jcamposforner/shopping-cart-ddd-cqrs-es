import AddItemToCart from "../../../../../sales/shopping-cart/application/add-item/add-item-to-cart";
import {addService, getService} from "../container";
import BusProductSearcher from "../../../../../sales/shopping-cart/infrastructure/acl/BusProductSearcher";
import ProductSearcher from "../../../../../sales/product/application/search/product-searcher";

export const registerApplicationServices = (): void => {
    addService(
        new ProductSearcher(getService("ProductRepository")), ProductSearcher
    );
    addService(
        new BusProductSearcher(getService(ProductSearcher)), BusProductSearcher
    );
    addService(
        new AddItemToCart(
            getService("ShoppingCartRepository"),
            getService(BusProductSearcher)
        ),
        AddItemToCart
    );
}
