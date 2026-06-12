// System Constants
export const SYSTEM_NAME = "KAKUTA USA";
export const API_IMAGE_URL = import.meta.env.VITE_SUPABASE_IMAGE_URL || "https://fmexudkfblghjesavdqp.supabase.co/storage/v1/object/public/product-images/";
export const API_MODEL_URL = import.meta.env.VITE_SUPABASE_MODEL_URL || "https://fmexudkfblghjesavdqp.supabase.co/storage/v1/object/public/product-models/";
// Public / Web routes
export const HOME_PATH = "/";
export const ABOUT_PATH = "/about";
export const PRODUCTS_PATH = "/products";
export const PRODUCT_DETAIL_PATH = "/products/:id";
export const PRODUCT_3D_PATH = "/products/:productId/generatemodel";
export const CONTACT_PATH = "/contact";
export const LOGIN_PATH = "/login";

// System / Admin routes
export const ADMIN_PATH = "/admin/"
export const DASHBOARD = ADMIN_PATH + "dashboard"
export const CONTENTS = ADMIN_PATH + "contents"
export const CONTENTTYPES = ADMIN_PATH + "content-types"
export const ADDRESS = ADMIN_PATH + "address"
export const ADDRESSTYPES = ADMIN_PATH + "address-types"
export const CATEGORIES = ADMIN_PATH + "categories"
export const PRODUCTS = ADMIN_PATH + "products"
export const REQUESTS3D = ADMIN_PATH + "requests3d"
export const PROFILE = ADMIN_PATH + "profile"