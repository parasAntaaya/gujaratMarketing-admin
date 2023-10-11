const { combineReducers } = require("redux");
const { resettableReducer } = require("reduxsauce");
const { AuthTypes } = require("./authRedux");

const resettable = resettableReducer(AuthTypes.LOGOUT);
const rootReducer = combineReducers({
  auth: resettable(require("./authRedux").reducer),
  catalogsData: resettable(require("./catalogRedux").reducer),
  productData: resettable(require("./productRedux").reducer),
  salesPersonData: resettable(require("./salesRedux").reducer),
  shopData: resettable(require("./shopRedux").reducer),
  agencyData: resettable(require("./agencyRedux").reducer),
  deliveryData: resettable(require("./deliveryRedux").reducer),
  common: resettable(require("./commonRedux").reducer),
  stockData: resettable(require("./StockRedux").reducer),
  orderData: resettable(require("./OrderRedux").reducer),
  salesOfficerData: resettable(require("./salesofficerRedux").reducer),
  freezeData: resettable(require("./freezeRedux").reducer),
  freezeBookingData: resettable(require("./freezeBookingRedux").reducer),
  shopgroupData: resettable(require("./ShopGroupRedux").reducer),
  routeData : resettable(require("./routeRedux").reducer),
  complainData : resettable(require("./complainRedux").reducer),
  attandanceData :  resettable(require("./attendanceRedux").reducer),
  imageData : resettable(require("./imageRedux").reducer),
  agencyTargetData : resettable(require("./agencyTargetRedux").reducer),
  schemeData : resettable(require("./schemeRedux").reducer)
});
module.exports = { rootReducer };
