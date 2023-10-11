const { default: axios } = require("axios");
const { createActions, createReducer } = require("reduxsauce");

const INITIAL_STATE = {
  user: null,
  showIntro: true,
  darkMode: false,
};

/* ------------- Types and Action Creators ------------- */
const { Types, Creators } = createActions({
  setUser: ["user"],
  setShowIntro: ["showIntro"],
  setDarkMode: ["darkMode"],
  logout: null,
});
const AuthTypes = Types;

/* ------------- Reducers ------------- */
const setDarkMode = (state, { darkMode }) => ({
  ...state,
  darkMode,
});

const setUser = (state, { user }) => {
  console.log("user===========",user)
  console.log("state++++++++++++++",state)
  axios.defaults.headers.common["Authorization"] = `${user?.token}`;
  return {
    ...state,
    user,
  };
};

const setShowIntro = (state, data) => {
  return {
    ...state,
    showIntro: data,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_USER]: setUser,
  [Types.SET_SHOW_INTRO]: setShowIntro,
  [Types.SET_DARK_MODE]: setDarkMode,
});

module.exports = { ...Creators, AuthTypes, reducer };
