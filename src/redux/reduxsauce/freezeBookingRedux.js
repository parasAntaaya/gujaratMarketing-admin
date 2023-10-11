const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  freezeBooking: null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setFreezeBooking: ["freezeBooking"],
});

const freezeBookingTypes = Types;

/* ------------- Reducers ------------- */

const setFreezeBooking = (state, { freezeBooking }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    freezeBooking,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_FREEZE_BOOKING]: setFreezeBooking,
});

module.exports = { ...Creators, freezeBookingTypes, reducer };
