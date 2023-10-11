const { createActions, createReducer } = require("reduxsauce");
const INITIAL_STATE = {
  complain: null,


};
/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  setComplain: ["complain"],
});

const ComplainTypes = Types;
/* ------------- Reducers ------------- */
const setComplain = (state, { complain }) => {
  return {
    ...state,
    complain,
  };
};
/* ------------- Hookup Reducers To Types ------------- */
const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_COMPLAIN]: setComplain,
});

module.exports = { ...Creators, ComplainTypes, reducer };
