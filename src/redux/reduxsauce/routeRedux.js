const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  route: null,
};

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  setRoute: ["route"],
});
const RouteTypes = Types;

/* ------------- Reducers ------------- */
const setRoute = (state, { route }) => {
  return {
    ...state,
    route,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_ROUTE]: setRoute,
});

module.exports = { ...Creators, RouteTypes, reducer };
