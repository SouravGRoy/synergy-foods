import { cartCache } from "./cart";
import { categoryCache, productTypeCache, subcategoryCache } from "./category";
import { mediaItemCache } from "./media-item";
import { userCache } from "./user";
import { wishlistCache } from "./wishlist";
import { bannerCache } from "./banner";


export const cache = {
    banner: bannerCache,
    cart: cartCache,
    category: categoryCache,
    productType: productTypeCache,
    subcategory: subcategoryCache,
    mediaItem: mediaItemCache,
    user: userCache,
    wishlist: wishlistCache,
};
