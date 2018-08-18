import update from "immutability-helper";

import {
  LOGOUT,
  SET_LOGGEDIN,
  SET_REDIRECT_URL,
  SET_SPINNER
} from "../actions";
import {
  VALIDATE_TOKEN_SUCCESS,
  VALIDATE_TOKEN_FAILURE,
  GET_PROFILE_SUCCESS
} from "../actions/apiProfileActions";

const INITIAL_STATE = {
  loggedIn: false,
  authToken: "",
  spinnerClass: "spinner__hide",
  form: {
    title: "",
    city: "",
    state: "",
    error: false,
    touched: {},
    showFieldErrors: {},
    validationErrors: {},
    showFormError: false,
    submit: false
  },
  redirect: ""
};

function appState(state = INITIAL_STATE, action) {
  // let error;
  switch (action.type) {
    case LOGOUT:
      window.localStorage.clear(); // do this in the component, not the reducer...
      return INITIAL_STATE;

    case SET_SPINNER:
      return update(state, {
        spinnerClass: { $set: `spinner__${action.payload}` }
      });

    case VALIDATE_TOKEN_SUCCESS:
      return update(state, {
        loggedIn: { $set: true },
        authToken: { $set: action.meta.token } // meta or payload??
      });

    case GET_PROFILE_SUCCESS:
      return update(state, {
        authToken: { $set: action.payload.token } // meta or payload??
      });

    case VALIDATE_TOKEN_FAILURE:
      window.localStorage.clear(); // do this somewhere else
      return update(state, { loggedIn: { $set: false } });

    case SET_REDIRECT_URL:
      return update(state, { redirect: { $set: action.payload } });

    case SET_LOGGEDIN:
      console.log("set loggedin");
      return update(state, { loggedIn: { $set: true } });

    default:
      return state;
  }
}

export default appState;