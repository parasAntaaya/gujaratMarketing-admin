const { createActions, createReducer } = require("reduxsauce");
const INITIAL_STATE = {
  Scheme:null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setScheme: ["Scheme"],
});

const SchemeTypes = Types;

/* ------------- Reducers ------------- */

const setScheme = (state, { Scheme }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    Scheme,
  };
};
/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SCHEME]: setScheme,
});

module.exports = { ...Creators, SchemeTypes, reducer };
