const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  products: null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setProducts: ["products"],
});

const ProductsTypes = Types;

/* ------------- Reducers ------------- */

const setProducts = (state, { products }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    products,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_PRODUCTS]: setProducts,
});

module.exports = { ...Creators, ProductsTypes, reducer };
