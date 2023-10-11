const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  salesPersons: null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setSalesPersons: ["salesPersons"],
});

const salesPersonsTypes = Types;

/* ------------- Reducers ------------- */

const setSalesPersons = (state, { salesPersons }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    salesPersons,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SALES_PERSONS]: setSalesPersons,
});

module.exports = { ...Creators, salesPersonsTypes, reducer };
