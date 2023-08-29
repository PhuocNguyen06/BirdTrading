import "./App.css";
import { Route, Routes } from "react-router-dom";
import LayoutContainer from "./container/layout/LayoutContainer";
import DashBoard from "./container/dashboard/DashBoard";
import { breadCrumbs } from "./config/constant";
import Products from "./container/product-layout/Products";
import TestPage from "./container/test-page/TestPage";
import UpdateProductPage from "./container/update-product-page/UpdateProductPage";
import "cropperjs/dist/cropper.css";
import GetToken from "./component/get-token/GetToken";
import ShopOrderPage from "./container/shop-order-page/ShopOrderPage";
import ShopOrderDataGrid from "./component/shop-order-data-grid/ShopOrderDataGrid";
import ShopOrderDetailsDataGrid from "./component/shop-order-details-data-grids/ShopOrderDetailsDataGrid";
import ShopStaffPage from "./container/shop-staff-page/ShopStaffPage";
import ShopStaffDataGrid from "./component/shop-staff-data-grid/ShopStaffDataGrid";
import CreateShopStaff from "./container/create-shop-staff/CreateShopStaff";
import ShopOwnerSettings from "./container/shop-owner-settings/ShopOwnerSettings";
import AdminDashboard from "./container/admin-dashboard/AdminDashboard";
import ShopViewOrderDetails from "./container/shop-view-order-details/ShopViewOrderDetails";
import PageNotFound from "./container/page-not-found/PageNotFound";
import ReviewPage from "./container/review-page/ReviewPage";
import ReviewDetails from "./container/review-details/ReviewDetails";
import AdminProductsPage from "./container/admin-products-page/AdminProductsPage";
import AdminOrderPage from "./container/admin-order-page/AdminOrderPage";
import AdminShopOwnerPage from "./container/admin-shop-owner-page/AdminShopOwnerPage";
import AdminUserPage from "./container/admin-user-page/AdminUserPage";
import AdminOrderTable from "./component/admin-order-table/AdminOrderTable";
import AdminPackageTable from "./component/admin-package-table/AdminPackageTable";
import HandleBanned from "./component/handle-banned/HandleBanned";
import LogOrderStaff from "./component/log-order-staff/LogOrderStaff";
import AdminPromotion from "./container/admin-promotion/AdminPromotion";

function App() {
   return (
      <Routes>
         <Route path="/" element={<LayoutContainer />}>
            <Route index element={<DashBoard />} />
            <Route path={"/page-not-found"} element={<PageNotFound />} />
            <Route path={breadCrumbs.PRODUCTS.url} element={<Products />} />
            <Route path={breadCrumbs.ORDER.url} element={<ShopOrderPage />}>
               <Route index element={<ShopOrderDataGrid />} />
               <Route
                  path="order-details"
                  element={<ShopOrderDetailsDataGrid />}
               />
            </Route>
            <Route path="create-product" element={<UpdateProductPage />} />
            <Route path="logout" element={<TestPage />} />
            <Route path="get-token" element={<GetToken />} />
            <Route path={breadCrumbs.STAFF.url} element={<ShopStaffPage />}>
               <Route index element={<ShopStaffDataGrid />} />
               <Route path={"create-staff"} element={<CreateShopStaff />} />
               <Route path={"log-order"} element={<LogOrderStaff />} />
            </Route>
            <Route
               path={`${breadCrumbs.UPDATE_PRODUCT.url}/:id`}
               element={<UpdateProductPage />}
            />
            <Route
               path={`${breadCrumbs.SETTINGS.url}`}
               element={<ShopOwnerSettings />}
            />
            <Route
               path={`${breadCrumbs.REVIEWS.url}`}
               element={<ReviewPage />}
            />
            <Route
               path="order/order-details/:orderId"
               element={<ShopViewOrderDetails />}
            />

            <Route
               path="review-details/:reviewId"
               element={<ReviewDetails />}
            />
            <Route path="handle-banned" element={<HandleBanned />} />
         </Route>
         <Route path="/admin/" element={<LayoutContainer />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="package-order/" element={<AdminOrderPage />}>
               <Route path="order" element={<AdminOrderTable />} />
               <Route index element={<AdminPackageTable />} />
            </Route>
            <Route path="user" element={<AdminUserPage />} />
            <Route path="shop-owner" element={<AdminShopOwnerPage />} />
            <Route path="promotion" element={<AdminPromotion />} />
         </Route>
      </Routes>
   );
}

export default App;
