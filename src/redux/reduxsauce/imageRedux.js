const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  image: null,
};

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setImage: ["image"],
});

const ImageTypes = Types;

/* ------------- Reducers ------------- */

const setImage = (state, { image }) => {
  return {
    ...state,
    image,
  };
};

/* ------------- Hookup Reducers To Types ------------- */

const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_IMAGE]: setImage,
});

module.exports = { ...Creators, ImageTypes, reducer };
