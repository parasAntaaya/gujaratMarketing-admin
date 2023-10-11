const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  deliveryPersons: null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setDeliveryPersons: ["deliveryPersons"],
});

const deliveryPersonsTypes = Types;

/* ------------- Reducers ------------- */

const setDeliveryPersons = (state, { deliveryPersons }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    deliveryPersons,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_DELIVERY_PERSONS]: setDeliveryPersons,
});

module.exports = { ...Creators, deliveryPersonsTypes, reducer };
