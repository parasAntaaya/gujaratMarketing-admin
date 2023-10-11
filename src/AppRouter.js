// import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import AdminLayout from "./Components/Layout";
import Dashboard from "./pages/Dashboard";
import Salesman from "./pages/Salesman";
import Deliveryman from "./pages/Deliveryman";
import Agency from "./pages/Agency";
import Shop from "./pages/Shop";
import ShopGroup from "./pages/ShopGroup";
import AddOrEditAgency from "./pages/AddOrEditAgency";
import AddOrEditDeliveryman from "./pages/AddOrEditDeliveryman";
import AddOrEditSalesPerson from "./pages/AddorEditSalesPerson";
import AddOrEditShop from "./pages/AddOrEditShop";
import AddOrEditSalesOfficer from "./pages/AddOrEditSalesOfficer";
import { useSelector } from "react-redux";
import Product from "./pages/Product";
import Catalog from "./pages/Catalog";
import AddOrEditProduct from "./pages/AddOrEditProduct";
import TabMaster from "./pages/TabMaster";
import Profile from "./pages/Profile";
import Login from "./pages/login";
import AddOrEditCatalog from "./pages/AddOrEditCatalog";
import Order from "./pages/Order";
import AddorEditDailyRoute from "./pages/AddorEditDailyRoute/index";
import Stock from "./pages/Stock";
import SalesOfficer from "./pages/SalesOfficer";
import PhotoGallery from "./pages/PhotoGallery";
import Events from "./pages/Events";
import AddPhoto from "./pages/AddPhoto";
import AddEvent from "./pages/AddOrEditEvents";
import Freeze from "./pages/Freeze";
import AddOrEditFreeze from "./pages/AddOrEditFreeze";
import FreezeBooking from "./pages/FreezeBooking";
import AddOrEditFreezeBooking from "./pages/AddOrEditFreezeBooking";
// import AddOrEditStock from "./pages/AddOrEditStock";
// import AddShopRoute from "./Components/AddShopRouteModal";
import DailyRoute from "./pages/DailyRoute/index";
import AgencyTarget from "./pages/AgencyTarget";
import Variant from "./pages/Variant";
import AddOrEditVariant from "./pages/AddOrEditVariant";
import StockTransfer from "./pages/StockTransfer";
import StockTransferHistory from "./pages/StockTransferHistory";
import UpdateStock from "./pages/AddOrEditStock";
import AddOrEditOrder from "./pages/AddOrEditOrder/Index";
import Notification from "./pages/Notification";
import Complain from "./pages/Complain";
import AddOrEditAgencyTarget from "./pages/AddOrEditAgencyTarget";
import Attandance from "./pages/Attandance/index";
import Report from "./pages/Report/index";
import DailyPurchaseReport from "./pages/DailyPurchaseReport";
import Godownstock from "./pages/GodownstockReport";
import PerDaySaleBillReport from "./pages/PerDaySaleBillReport";
import RouteWiseSaleReport from "./pages/RouteWiseSaleReport";
import ItemWiseSaleReport from "./pages/ItemWiseSaleReport";
import ZeroBillingReport from "./pages/ZeeroBillingReport";
import ProductAssign from "./pages/ProductAssign";
import MenuMaster from "./pages/MenuMaster";
import React from "react";
import NotFoundPage from "./NotFoundPage ";
import AddOrEditShopGroup from "./pages/AddOrEditShopGroup";
import AddStock from "./pages/AddStock";
import PurchaseBill from "./pages/PurchaseBill";
import AddOrEditScheme from "./pages/AddorEditScheme/Index";
import Scheme from "./pages/Schame/Index";
import AgencyToAgencyTransfer from "./pages/AgencyToAgencyTransfer";
import StockHistory from "./pages/StockHistory/index";
import Reason from "./pages/Reason/index";
import AddOrEditReason from "./pages/AddOrEditReason/index";
import Survey from "./pages/Survey";

export const ProtectedRoutes = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return (
      <AdminLayout>
        <Outlet />;
      </AdminLayout>
    );
  } else {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }
};

export function AppRouter() {
  const user = useSelector((state) => state.auth?.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        {user?.role === "admin" ? (
          // admin routers if role is admin
          <React.Fragment>
            <Route element={<ProtectedRoutes isAuthenticated={user} />}>
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product" element={<Product />} />
              <Route path="/assign-product" element={<ProductAssign />} />
              <Route path="/scheme" element={<Scheme />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tabmaster" element={<TabMaster />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agency" element={<Agency />} />
              <Route path="/salesman" element={<Salesman />} />
              <Route path="/events" element={<Events />} />
              <Route path="/photogallery" element={<PhotoGallery />} />
              <Route path="/order" element={<Order />} />
              <Route path="/dailyroute" element={<DailyRoute />} />
              <Route path="/agencytarget" element={<AgencyTarget />} />
              <Route path="/purchase-bill/add-stock" element={<AddStock />} />
              <Route path="/stockhistory" element={<StockHistory />} />
              <Route path="/survey" element={<Survey />} />

              {/*  ======*/}
              <Route
                path="stock/salesman-stock-transfer"
                element={<StockTransfer />}
              />
              <Route path="/purchase-bill" element={<PurchaseBill />} />

              <Route path="/attandance" element={<Attandance />} />

              <Route
                path="/salesman/add-salesman"
                element={<AddOrEditSalesPerson />}
              />
              <Route
                path="/dailyroute/add-dailyroute"
                element={<AddorEditDailyRoute />}
              />
              <Route
                path="/dailyroute/edit-dailyroute"
                element={<AddorEditDailyRoute />}
              />
              <Route path="/photogallery/add-photo" element={<AddPhoto />} />
              <Route path="/photogallery/edit-photo" element={<AddPhoto />} />
              <Route path="/events/add-event" element={<AddEvent />} />
              <Route path="/events/edit-event" element={<AddEvent />} />
              <Route
                path="/salesman/edit-salesman"
                element={<AddOrEditSalesPerson />}
              />
              <Route
                path="/salesofficer/edit-salesofficer"
                element={<AddOrEditSalesOfficer />}
              />
              <Route
                path="/salesofficer/add-salesofficer"
                element={<AddOrEditSalesOfficer />}
              />
              <Route path="/agency/add-agency" element={<AddOrEditAgency />} />
              <Route path="/agency/edit-agency" element={<AddOrEditAgency />} />
              <Route path="/deliveryman" element={<Deliveryman />} />
              <Route
                path="/deliveryman/add-deliveryman"
                element={<AddOrEditDeliveryman />}
              />
              <Route
                path="/deliveryman/edit-deliveryman"
                element={<AddOrEditDeliveryman />}
              />
              <Route path="/reason" element={<Reason />} />
              <Route path="/reason/add-reason" element={<AddOrEditReason />} />
              <Route path="/reason/edit-reason" element={<AddOrEditReason />} />
              {/* <Route path="/add-reason" element={<AddOrEditReason />} />
              <Route path="/edit-reason" element={<AddOrEditReason />} /> */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/shopGroup" element={<ShopGroup />} />
              <Route path="/shop/add-shop" element={<AddOrEditShop />} />
              <Route path="/shop/edit-shop" element={<AddOrEditShop />} />
              <Route
                path="/product/add-product"
                element={<AddOrEditProduct />}
              />
              <Route
                path="/product/edit-product"
                element={<AddOrEditProduct />}
              />

              <Route
                path="/catalog/add-catalog"
                element={<AddOrEditCatalog />}
              />
              <Route
                path="/catalog/edit-catalog"
                element={<AddOrEditCatalog />}
              />
              <Route path="/salesofficer" element={<SalesOfficer />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/freeze" element={<Freeze />} />
              <Route path="/freeze/add-freeze" element={<AddOrEditFreeze />} />
              <Route path="/freeze/edit-freeze" element={<AddOrEditFreeze />} />
              <Route path="/freeze-booking" element={<FreezeBooking />} />
              <Route
                path="/agencytarget/add-agency-target"
                element={<AddOrEditAgencyTarget />}
              />
              <Route
                path="/agencytarget/edit-agency-target"
                element={<AddOrEditAgencyTarget />}
              />
              <Route
                path="/freeze-booking/add-freeze-booking"
                element={<AddOrEditFreezeBooking />}
              />
              <Route
                path="/freeze-booking/edit-freeze-booking"
                element={<AddOrEditFreezeBooking />}
              />
              <Route
                path="/stock/agency-stock-transfer"
                element={<UpdateStock />}
              />
              <Route
                path="/stock/agencytoagency-stock-transfer"
                element={<AgencyToAgencyTransfer />}
              />

              <Route path="/stock/add-stock" element={<AddStock />} />

              <Route path="/category" element={<Variant />} />
              <Route
                path="/category/add-category"
                element={<AddOrEditVariant />}
              />
              <Route
                path="/category/edit-category"
                element={<AddOrEditVariant />}
              />
              <Route
                path="/stock-transfer/stock-transfer-history"
                element={<StockTransferHistory />}
              />
              <Route path="/order/add-order" element={<AddOrEditOrder />} />
              <Route path="/order/edit-order" element={<AddOrEditOrder />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/complain" element={<Complain />} />
              <Route path="/report" element={<Report />} />
              <Route
                path="/dailypurchasereport"
                element={<DailyPurchaseReport />}
              />
              <Route path="/godownstock" element={<Godownstock />} />
              <Route
                path="/perdaysalebillreport"
                element={<PerDaySaleBillReport />}
              />
              <Route
                path="/routewisesalereport"
                element={<RouteWiseSaleReport />}
              />
              <Route
                path="/itemwisesalereport"
                element={<ItemWiseSaleReport />}
              />
              <Route
                path="/zerobillingreport"
                element={<ZeroBillingReport />}
              />
              <Route
                path="/shopGroup/addshopGroup"
                element={<AddOrEditShopGroup />}
              />
              <Route
                path="/shopGroup/editshopGroup"
                element={<AddOrEditShopGroup />}
              />
              <Route path="/scheme/add-scheme" element={<AddOrEditScheme />} />
              <Route path="/scheme/edit-scheme" element={<AddOrEditScheme />} />
              <Route path="/menumaster" element={<MenuMaster />} />
              <Route path="*" element={<Navigate to="/not-found" />} />
              <Route path="/not-found" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/not-found" />} />
            </Route>
          </React.Fragment>
        ) : (
          // ----------------------------------------------------------------------------------------
          // agency routers if role is agency ----------------------------------------------------------------------------------------
          // ----------------------------------------------------------------------------------------
          <React.Fragment>
            <Route element={<ProtectedRoutes isAuthenticated={user} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/tabmaster" element={<TabMaster />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/salesman" element={<Salesman />} />
              <Route path="/photogallery" element={<PhotoGallery />} />
              <Route path="/order" element={<Order />} />
              <Route path="/product" element={<Product />} />
              <Route path="/dailyroute" element={<DailyRoute />} />
              <Route path="/agencytarget" element={<AgencyTarget />} />
              <Route path="/stock-transfer" element={<StockTransfer />} />
              <Route path="/attandance" element={<Attandance />} />
              <Route path="/scheme" element={<Scheme />} />
              <Route path="/purchase-bill" element={<PurchaseBill />} />
              <Route path="/reason" element={<Reason />} />
              <Route
                path="/salesman/add-salesman"
                element={<AddOrEditSalesPerson />}
              />
              <Route
                path="/dailyroute/add-dailyroute"
                element={<AddorEditDailyRoute />}
              />
              <Route
                path="/dailyroute/edit-dailyroute"
                element={<AddorEditDailyRoute />}
              />
              <Route path="/photogallery/add-photo" element={<AddPhoto />} />
              <Route path="/photogallery/edit-photo" element={<AddPhoto />} />
              <Route
                path="/salesman/edit-salesman"
                element={<AddOrEditSalesPerson />}
              />
              <Route path="/agency/add-agency" element={<AddOrEditAgency />} />
              <Route path="/agency/edit-agency" element={<AddOrEditAgency />} />
              <Route path="/deliveryman" element={<Deliveryman />} />
              <Route
                path="/deliveryman/add-deliveryman"
                element={<AddOrEditDeliveryman />}
              />
              <Route
                path="/deliveryman/edit-deliveryman"
                element={<AddOrEditDeliveryman />}
              />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shopGroup" element={<ShopGroup />} />
              <Route path="/shop/add-shop" element={<AddOrEditShop />} />
              <Route path="/shop/edit-shop" element={<AddOrEditShop />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/freeze" element={<Freeze />} />
              <Route path="/freeze/add-freeze" element={<AddOrEditFreeze />} />
              <Route path="/freeze/edit-freeze" element={<AddOrEditFreeze />} />
              <Route path="/freeze-booking" element={<FreezeBooking />} />
              <Route
                path="/agencytarget/add-agency-target"
                element={<AddOrEditAgencyTarget />}
              />
              <Route
                path="/agencytarget/edit-agency-target"
                element={<AddOrEditAgencyTarget />}
              />
              <Route
                path="/freeze-booking/add-freeze-booking"
                element={<AddOrEditFreezeBooking />}
              />
              <Route
                path="/freeze-booking/edit-freeze-booking"
                element={<AddOrEditFreezeBooking />}
              />
              <Route path="/stock/update-stock" element={<UpdateStock />} />

              <Route path="/category" element={<Variant />} />
              <Route
                path="/category/add-category"
                element={<AddOrEditVariant />}
              />
              <Route
                path="/category/edit-category"
                element={<AddOrEditVariant />}
              />
              <Route
                path="/stock-transfer/stock-transfer-history"
                element={<StockTransferHistory />}
              />
              <Route
                path="/product/add-product"
                element={<AddOrEditProduct />}
              />
              <Route
                path="/product/edit-product"
                element={<AddOrEditProduct />}
              />
              <Route path="/order/add-order" element={<AddOrEditOrder />} />
              <Route path="/order/edit-order" element={<AddOrEditOrder />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/complain" element={<Complain />} />
              <Route path="/report" element={<Report />} />
              <Route path="/stockhistory" element={<StockHistory />} />

              <Route
                path="/dailypurchasereport"
                element={<DailyPurchaseReport />}
              />
              <Route path="/godownstock" element={<Godownstock />} />
              <Route
                path="/perdaysalebillreport"
                element={<PerDaySaleBillReport />}
              />
              <Route
                path="/routewisesalereport"
                element={<RouteWiseSaleReport />}
              />
              <Route
                path="/itemwisesalereport"
                element={<ItemWiseSaleReport />}
              />
              <Route
                path="/zerobillingreport"
                element={<ZeroBillingReport />}
              />
              <Route
                path="/shopGroup/addshopGroup"
                element={<AddOrEditShopGroup />}
              />
              <Route
                path="/shopGroup/editshopGroup"
                element={<AddOrEditShopGroup />}
              />
              <Route path="/menumaster" element={<MenuMaster />} />
              <Route path="*" element={<Navigate to="/not-found" />} />
              <Route path="/not-found" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/not-found" />} />
            </Route>
          </React.Fragment>
        )}
      </Routes>
    </BrowserRouter>
  );
}
