const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  Order:null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setOrder: ["Order"],
});

const OrderTypes = Types;

/* ------------- Reducers ------------- */

const setOrder = (state, { Order }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    Order,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_ORDER]: setOrder,
});

module.exports = { ...Creators, OrderTypes, reducer };
