const { createActions, createReducer } = require("reduxsauce");
const INITIAL_STATE = {
  agencytarget: null,
};

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
    setAgencyTarget: ["agencytarget"],
});

const AgencyTargetTypes = Types;

/* ------------- Reducers ------------- */
const setAgencyTarget = (state, { agencytarget }) => {
  return {
    ...state,
    agencytarget,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_AGENCY_TARGET]: setAgencyTarget,
});

module.exports = { ...Creators, AgencyTargetTypes, reducer };
