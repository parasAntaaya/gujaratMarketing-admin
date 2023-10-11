const { createActions, createReducer } = require("reduxsauce");
const INITIAL_STATE = {
  catalogs: null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setCatalogs: ["catalogs"],
});

const CatalogsTypes = Types;

/* ------------- Reducers ------------- */

const setCatalogs = (state, { catalogs }) => {
  return {
    ...state,
    catalogs,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CATALOGS]: setCatalogs,
});

module.exports = { ...Creators, CatalogsTypes, reducer };
