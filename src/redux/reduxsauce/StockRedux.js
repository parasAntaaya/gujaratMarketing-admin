const { createActions, createReducer } = require("reduxsauce");
const INITIAL_STATE = {
  Stock: [
    // {
    //   key: 1,
    //   name: "ZEERA",
    //   ava_stock: "300 Carton",
    //   dispatch: "100 Carton",
    //   total: "200 Carton",
    //   category: "160 ML",
    // },
    // {
    //   key: 2,
    //   name: "JEERA_KING",
    //   ava_stock: "300 Carton",
    //   dispatch: "100 Carton",
    //   total: "200 Carton",
    //   category: "200 ML",
    // },
    // {
    //   key: 3,
    //   name: "LIMPO",
    //   ava_stock: "300 Carton",
    //   dispatch: "100 Carton",
    //   total: "200 Carton",
    //   category: "300 ML",
    // },
    // {
    //   key: 4,
    //   name: "LIMUN",
    //   ava_stock: "300 Carton",
    //   dispatch: "100 Carton",
    //   total: "200 Carton",
    //   category: "750 ML",
    // },
    // {
    //   key: 5,
    //   name: "LYCHEE",
    //   ava_stock: "300 Carton",
    //   dispatch: "100 Carton",
    //   total: "200 Carton",
    //   category: "1.5 ML",
    // },
    // {
    //   key: 6,
    //   name: "ZEERA",
    //   ava_stock: "300 Carton",
    //   dispatch: "100 Carton",
    //   total: "200 Carton",
    //   category: "2.5 ML",
    // },
  ],
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setStock: ["stock"],
});

const StockTypes = Types;

/* ------------- Reducers ------------- */

const setStock = (state, { Stock }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    Stock,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_STOCK]: setStock,
});

module.exports = { ...Creators, StockTypes, reducer };
