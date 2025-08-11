import { addressQueries } from "./address";
import { bannerQueries } from "./banner";
import { cartQueries } from "./cart";
import {
    categoryQueries,
    categoryRequestQueries,
    productTypeQueries,
    subcategoryQueries,
} from "./category";
import { mediaItemQueries } from "./media-item";
import { productQueries } from "./product";
import { userQueries } from "./user";
import { wishlistQueries } from "./wishlist";

export const queries = {
    address: addressQueries,
    banner: bannerQueries,
    cart: cartQueries,
    category: categoryQueries,
    categoryRequest: categoryRequestQueries,
    productType: productTypeQueries,
    subcategory: subcategoryQueries,
    mediaItem: mediaItemQueries,
    product: productQueries,
    user: userQueries,
    wishlist: wishlistQueries,
};
