const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  salesOfficer: null,
};
console.log(" INITIAL_STATE==================", INITIAL_STATE);

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setSalesOfficer: ["salesOfficer"],
});


const salesOfficerTypes = Types;

/* ------------- Reducers ------------- */

const setSalesOfficer = (state, { salesOfficer }) => {
  // axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  return {
    ...state,
    salesOfficer,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_SALES_OFFICER]: setSalesOfficer,
});

module.exports = { ...Creators, salesOfficerTypes, reducer };
