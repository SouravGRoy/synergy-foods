import { addressQueries } from "./address";
import { cartQueries } from "./cart";
import {
    categoryQueries,
    productTypeQueries,
    subcategoryQueries,
} from "./category";
import { mediaItemQueries } from "./media-item";
import { notificationQueries } from "./notification";
import { productQueries } from "./product";
import { userQueries } from "./user";
import { wishlistQueries } from "./wishlist";
import { bannerQueries } from "./banner";


export const queries = {
    banner: bannerQueries,
    address: addressQueries,
    cart: cartQueries,
    category: categoryQueries,
    productType: productTypeQueries,
    subcategory: subcategoryQueries,
    mediaItem: mediaItemQueries,
    notification: notificationQueries,
    product: productQueries,
    user: userQueries,
    wishlist: wishlistQueries,
};
