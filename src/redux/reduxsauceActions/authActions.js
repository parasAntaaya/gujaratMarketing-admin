const axios = require("axios");
const AuthActions = require("../reduxsauce/authRedux");
const CommonActions = require("../reduxsauce/commonRedux");

const onBusinessDataSave =
  (body, files, callback) => async (dispatch, getState) => {
    const { user } = getState().auth;
    let formData = new FormData();
    body["id"] && formData.append("id", body["id"]);
    formData.append("businessName", body["name"]);
    body["address"] && formData.append("businessAddress", body["address"]);
    body["description"] &&
      body["description"] != "" &&
      formData.append("businessDescripation", body["description"]);

    files != undefined &&
      files.length > 0 &&
      files.map((o, index) => {
        o.type &&
          formData.append("businessLogo", {
            uri: o.uri,
            type: o.type == "Images" ? "image/jpeg" : "video/mp4",
            name:
              o.type == "Images"
                ? "image" + index + ".jpeg"
                : "video" + index + ".mp4",
          });
      });

    formData.append("userId", user["id"]);

    dispatch(CommonActions.setLoading(true));
    try {
      const response = await axios
        .post("/auth/update.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => response.data);
      dispatch(CommonActions.setLoading(false));
      console.log("Data Created :: ", response);

      if (response["success"] == 1) {
        dispatch(AuthActions.setUser(response.data));
        if (callback) {
          callback("success", response);
        }
      } else {
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: response["message"] || "Something want worng!",
          })
        );
      }
    } catch (e) {
      dispatch(CommonActions.setLoading(false));
      // console.log(e["response"]);
      e["response"]["data"] != undefined &&
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: e["response"]["data"]["message"],
          })
        );
    }
  };

const onUserRegister =
  ({ email, password, phone, first_name, last_name }, callback) =>
  async (dispatch, getState) => {
    dispatch(CommonActions.setLoading(true));
    try {
      const body = new FormData();
      body.append("mobile", phone);
      body.append("email", email);
      body.append("firstName", first_name);
      body.append("password", password);
      body.append("lastName", last_name);
      body.append("isActive", "active");
      const response = await axios
        .post("/auth/register.php", body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => response.data);
      dispatch(CommonActions.setLoading(false));
      console.log("new Registration :: ", response);

      if (response["success"] == 1) {
        console.log(
          "-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------",
          response.data
        );
        dispatch(AuthActions.setUser(response.data));
        if (callback) {
          callback("success", response);
        }
        // if (!response.isActive) {
        //   if (callback) {
        //     callback("verify-otp", { user: response['data'] });
        //   }
        // } else {
        //   dispatch(AuthActions.setUser(response));
        //   if (callback) {
        //     callback("success",response);
        //   }
        // }
      } else {
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: response["message"],
          })
        );
        return;
      }
    } catch (e) {
      dispatch(CommonActions.setLoading(false));
      console.log(e);
      e["response"] != undefined &&
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: e.response.message,
          })
        );
    }
  };

const onUserLogin =
  (username, password, callback) => async (dispatch, getState) => {
    const { common } = getState();
    dispatch(CommonActions.setLoading(true));
    axios.defaults.headers.common["Authorization"] = "";
    delete axios.defaults.headers.common["Authorization"];
    const body = new FormData();
    body.append("email", username);
    body.append("password", password);
    body.append("password", password);
    await axios
      .post("/auth/login.php", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.warn("User Log in :: ", response.data);
        dispatch(CommonActions.setLoading(false));
        if (response["data"]["success"] != 1) {
          return dispatch(
            CommonActions.setAlert({
              visible: true,
              content: response["data"]["message"] || "something went worng :(",
            })
          );
        }
        console.log(
          "----------------->>>>>>>>>>>",
          response["data"]["data"]["isActive"]
        );
        if (response["data"]["data"]["isActive"] == "true") {
          dispatch(AuthActions.setUser(response.data.data));
          dispatch(AuthActions.setEditPost(true));
          if (callback) {
            callback("success", response["data"]["data"], common.loginFrom);
          }
          dispatch(CommonActions.setLoginFrom(null));
        } else {
          if (callback) {
            callback("verify-otp", {
              user: {
                ...response.data.data,
                email: username,
              },
            });
          }
        }
      })
      .catch((e) => {
        console.log("e.response ---<", e.response);
        dispatch(
          CommonActions.setAlert({
            visible: true,
            content: e.response["message"],
          })
        );
        dispatch(CommonActions.setLoading(false));
      });
  };

const onBankDetailSave = (data, callback) => async (dispatch, getState) => {
  const { common } = getState();
  dispatch(CommonActions.setLoading(true));
  axios.defaults.headers.common["Authorization"] = "";
  delete axios.defaults.headers.common["Authorization"];
  const body = new FormData();
  body.append("bankName", data.bankName);
  body.append("userId", data.userId);
  body.append("bankAccountNo", data.bankAccountNo);
  body.append("bankIFSC", data.bankIFSC);
  body.append("bankDescripation", data.bankDescripation);
  await axios
    .post("/auth/bankDetails.php", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("response ------<<>>>>>>>", response);
      dispatch(CommonActions.setLoading(false));
      if (response["data"]["success"] != 1) {
        return dispatch(
          CommonActions.setAlert({
            visible: true,
            content: response["data"]["message"] || "something went worng :(",
          })
        );
      }

      if (callback) {
        dispatch(AuthActions.setUser(response["data"]["data"]));
        callback("success", response["data"]["data"]);
      }
    })
    .catch((e) => {
      console.log("e.response ---<", e);
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: e.response["message"],
        })
      );
      dispatch(CommonActions.setLoading(false));
    });
};
const onVerifyOTP = (data, callback) => async (dispatch, getState) => {
  const { common } = getState();
  dispatch(CommonActions.setLoading(true));
  const body = {
    otp: data.otp,
    user: data.id,
  };
  try {
    const response = await axios.post("/auth/verifyOtp.php", body);
    dispatch(AuthActions.setUser(response.data));
    dispatch(CommonActions.setLoading(false));
    if (callback) {
      callback("success", common.loginFrom);
    }
    dispatch(CommonActions.setLoginFrom(null));
  } catch (error) {
    console.log("error", error);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error.response["message"] || "Invalid OTP try again.",
      })
    );
    dispatch(CommonActions.setLoading(false));
  }
};

const onResendOTP = (body, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  await axios
    .post("/user/resendVerificationOtp", body)
    .then((response) => {
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: response["data"]["message"],
        })
      );
      dispatch(CommonActions.setLoading(false));
      if (callback) {
        callback("success");
      }
    })
    .catch((error) => {
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error.response["message"] || "Invalid OTP try again.",
        })
      );
      dispatch(CommonActions.setLoading(false));
    });
};

const onUserLogout = (callback) => async (dispatch, getState) => {
  dispatch(AuthActions.logout());
  dispatch(AuthActions.setEditPost(false));
  dispatch(CommonActions.setLoading(true));
  if (callback) {
    callback("success");
  }
  await axios
    .get("/auth/logout.php")
    .then(async (response) => {
      console.log("response", response);
      axios.defaults.headers.common["Authorization"] = "";
      delete axios.defaults.headers.common["Authorization"];
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: "Logout successfully",
          type: "success",
        })
      );
      dispatch(CommonActions.setLoading(false));
      if (callback) {
        callback("success");
      }
    })
    .catch((error) => {
      console.log("error->", error);
      dispatch(CommonActions.setLoading(false));
      CommonActions.setAlert({
        visible: true,
        content: error.response["message"] || "Something went wrong.",
      });
    });
};

const onForgotPassword = (username, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  try {
    const response = await axios.post("/auth/forgetPassword.php", {
      username: username,
    });
    dispatch(CommonActions.setLoading(false));
    console.log(response);
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: response["data"]["message"],
        type: "success",
      })
    );
    if (callback) {
      callback("success", response);
    }
  } catch (error) {
    dispatch(CommonActions.setLoading(false));
    dispatch(
      CommonActions.setAlert({
        visible: true,
        content: error["response"]["message"],
      })
    );
  }
};

const onUpdateUserData = (data) => async (dispatch, getState) => {
  const { auth } = getState();
  dispatch(AuthActions.setUser({ ...auth.user }));
};

const onResetPassword = (body, callback) => async (dispatch, getState) => {
  dispatch(CommonActions.setLoading(true));
  await axios
    .post("/auth/resetPassword.php", body)
    .then((response) => {
      dispatch(CommonActions.setLoading(false));
      callback && callback("success", response);
    })
    .catch((error) => {
      console.log("error->", error);
      dispatch(
        CommonActions.setAlert({
          visible: true,
          content: error["response"]["message"],
        })
      );
      dispatch(CommonActions.setLoading(false));
    });
};

const onAdsLoad = () => (dispatch, getState) => {
  axios
    .get("https://ikmobile.000webhostapp.com/ARC_API/config/DataEntryAds")
    .then((res) => {
      console.log("sds res >", res);
      // res?.data ?  dispatch(AuthActions?.setAds(res.data)) : null;
    })
    .catch((err) => {
      console.log(err);
    });
};

const onShowIntro = (data) => (dispatch, getState) => {
  dispatch(AuthActions?.setShowIntro(data));
};
module.exports = {
  onResetPassword,
  onUpdateUserData,
  onAdsLoad,
  onForgotPassword,
  onUserLogout,
  onResendOTP,
  onVerifyOTP,
  onUserLogin,
  onUserRegister,
  onUserLogout,
  onBusinessDataSave,
  onBankDetailSave,
  onShowIntro,
};
