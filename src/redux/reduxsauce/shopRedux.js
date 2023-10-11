const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  shop:null,
  switchStates: {},
};
 
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setShop: ["shop"],
});

const shopTypes = Types;

/* ------------- Reducers ------------- */

const setShop = (state, { shop }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    shop,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SHOP]: setShop,
});

module.exports = { ...Creators, shopTypes, reducer };
