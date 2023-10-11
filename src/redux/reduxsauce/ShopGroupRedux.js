const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  shopGroup: null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setShopGroup: ["shopGroup"],
});

const shopGroupTypes = Types;

/* ------------- Reducers ------------- */

const setShopGroup = (state, { shopGroup }) => {
  return {
    ...state,
    shopGroup,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SHOP_GROUP]: setShopGroup,
});

module.exports = { ...Creators, shopGroupTypes, reducer };
