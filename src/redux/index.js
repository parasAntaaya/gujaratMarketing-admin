const { applyMiddleware, createStore } = require("redux");
const { persistReducer, persistStore } = require("redux-persist");
const thunk = require("redux-thunk").default;
const logger = require("redux-logger").default;
const axios = require("axios");
const { rootReducer } = require("./reduxsauce");
const storage = require("redux-persist/lib/storage").default;

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["common", "order", "cart"],
  whitelist: ["auth", "config", "promotion", "recentProducts"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk, logger));

const setUpAxios = (url) => {
  axios.defaults.baseURL = url;
};
setUpAxios("http://15.206.212.252/api/dev");

const getErrorMessage = (data) => {
  // check for data is object
  if (data["message"] && data["message"] !== undefined) {
    return data.message;
  }

  if (typeof data == "object" && !Array.isArray(data)) {
    return getErrorMessage(data[Object.keys(data)[0]]);
  }
  //  check for array
  if (Array.isArray(data)) {
    return getErrorMessage(
      data.length > 0 ? data[0] : "Error message not found."
    );
  }
  if (typeof data == "string") {
    return data;
  }
};

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      axios.defaults.headers.common["Authorization"] = "";
      delete axios.defaults.headers.common["Authorization"];
      // window.store.dispatch(AuthActions.logout());
      error = {
        ...error,
        response: { message: getErrorMessage(error.response.data.message) },
      };
    }

    if (typeof error.response === "undefined") {
      error = { ...error, response: { message: "Network error!" } };
    }

    if (error.response.status === 400) {
      error = {
        ...error,
        response: {
          ...error.response,
          message: getErrorMessage(error.response?.data?.message),
        },
      };
    }

    if (error.response.status === 403) {
      error = {
        ...error,
        response: {
          message: "You don't have permission to access this resource.",
        },
      };
    }

    if (error.response.status === 500) {
      error = { ...error, response: { message: "Internal server error!" } };
    }
    return Promise.reject(error);
  }
);

const persistor = persistStore(store, {}, () => {
  const { user } = store.getState().auth;
  if (user && user["token"]) {
    axios.defaults.headers.common["Authorization"] = `${user["token"]}`;
  } else {
    axios.defaults.headers.common["Authorization"] = "";
    delete axios.defaults.headers.common["Authorization"];
  }
});

module.exports = {
  store,
  persistor,
  setUpAxios,
};
