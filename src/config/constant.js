export const breadCrumbs = {
   DASH_BOARD: {
      name: "Dashboard",
      url: "",
      id: 1,
   },
   ADMIN_DASH_BOARD: {
      name: "Dashboard",
      url: "/admin",
      id: 1,
   },
   ADMIN_PRODUCTS: {
      name: "Products",
      url: "/admin/products",
      id: 2,
   },
   ADMIN_ORDER: {
      name: "Orders",
      url: "/admin/order",
      id: 3,
   },
   ADMIN_SHOP_OWNER: {
      name: "Shop Owners",
      url: "/admin/shop-owner",
      id: 4,
   },
   ADMIN_USER: {
      name: "Users",
      url: "/admin/user",
      id: 5,
   },
   ADMIN_PROMOTION: {
      name: "Promotion",
      url: "/admin/promotion",
      id: 100,
   },
   ADMIN_REPORTS: {
      name: "Reports",
      url: "/admin/report",
      id: 6,
   },
   ADMIN_PACKAGE: {
      name: "Package",
      url: "/admin/package-order",
      id: 7,
   },
   SUMMARY_ORDERS: {
      name: "Summary order",
      url: "dashboard/summary-order",
   },
   ORDER: {
      name: "Order",
      url: "order",
      id: 3,
   },
   PRODUCTS: {
      name: "Products",
      url: "products",
      id: 2,
   },
   CREATE_PRODUCTS: {
      name: "Create product",
      url: "/create-product",
   },
   UPDATE_PRODUCT: {
      name: "Update product",
      url: "products/update-product",
   },
   ORDER_DETAILS: {
      name: "Order details",
      url: "orders/order-details",
   },
   BIRDS: {
      name: "Birds",
      url: "/birds",
   },
   ACCESSORIES: {
      name: "Accessories",
      url: "/accessories",
   },
   FOOD: {
      name: "Food",
      url: "/food",
   },
   STAFF: {
      name: "Staff",
      url: "staff",
      id: 4,
   },
   REVIEWS: {
      name: "Reviews",
      url: "/reviews",
      id: 5,
   },
   REVIEWS_DETAILS: {
      name: "Reviews details",
      url: "/reviews-details",
      id: 111,
   },
   REPORTS: {
      name: "Reports",
      url: "/reports",
      id: 6,
   },
   SUPPORT: {
      name: "Support",
      url: "/support",
      id: 8,
   },
   SETTINGS: {
      name: "Settings",
      url: "/settings",
      id: 7,
   },
};

export const CATEGORY = [
   {
      id: 1,
      name: "Birds",
      url: "birds",
   },
   {
      id: 2,
      name: "Food",
      url: "foods",
   },
   {
      id: 3,
      name: "Accessories",
      url: "accessories",
   },
];
export const category = {
   BIRDS: {
      id: 1,
      name: "Birds",
      url: "birds",
   },
   FOODS: {
      id: 2,
      name: "Food",
      url: "foods",
   },
   ACCESSORIES: {
      id: 3,
      name: "Accessories",
      url: "accessories",
   },
};

export const userRole = {
   GUEST: {
      code: 0,
   },
   USER: {
      code: 1,
   },
   SHOP_STAFF: {
      code: 2,
   },
   SHOP_OWNER: {
      code: 3,
   },
   ADMIN: {
      code: 4,
   },
};


export const modelStyle = {
   position: "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: "fit-content",
};

export const orderStatus = {
   PENDING: {
      code: 0,
      string: "PENDING",
   },
   PROCESSING: {
      code: 1,
      string: "PROCESSING",
   },
   SHIPPED: {
      code: 2,
      string: "SHIPPED",
   },
};
