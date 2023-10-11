const { createActions, createReducer } = require("reduxsauce");
const INITIAL_STATE = {
  attandance: null,
};

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setAttandance: ["attandance"],
});

const AttandanceTypes = Types;

/* ------------- Reducers ------------- */
const setAttandance = (state, { attandance }) => {
  return {
    ...state,
    attandance,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_ATTANDANCE]: setAttandance,
});

module.exports = { ...Creators, AttandanceTypes, reducer };
