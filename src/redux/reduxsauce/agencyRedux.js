const { createActions, createReducer } = require("reduxsauce");
const INITIAL_STATE = {
  agency: null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setAgency: ["agency"],
});

const agencyTypes = Types;

/* ------------- Reducers ------------- */

const setAgency = (state, { agency }) => {
  console.log("agency=-=====", agency);
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    agency,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_AGENCY]: setAgency,
});

module.exports = { ...Creators, agencyTypes, reducer };
