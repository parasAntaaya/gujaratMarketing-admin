const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  freeze: null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setFreeze: ["freeze"],
});

const freezeTypes = Types;

/* ------------- Reducers ------------- */

const setFreeze = (state, { freeze }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    freeze,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_FREEZE]: setFreeze,
});

module.exports = { ...Creators, freezeTypes, reducer };
