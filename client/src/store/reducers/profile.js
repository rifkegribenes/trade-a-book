import update from "immutability-helper";

import {
  VALIDATE_TOKEN_REQUEST,
  VALIDATE_TOKEN_SUCCESS,
  VALIDATE_TOKEN_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  GET_PARTIAL_PROFILE_REQUEST,
  GET_PARTIAL_PROFILE_SUCCESS,
  GET_PARTIAL_PROFILE_FAILURE,
  MODIFY_PROFILE_REQUEST,
  MODIFY_PROFILE_SUCCESS,
  MODIFY_PROFILE_FAILURE
} from "../actions/apiProfileActions";

const INITIAL_STATE = {
  spinnerClass: "spinner__hide",
  profile: {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatarUrl: "",
    city: "",
    state: ""
  },
  error: null
};

function profile(state = INITIAL_STATE, action) {
  let error;

  switch (action.type) {
    case VALIDATE_TOKEN_REQUEST:
    case GET_PROFILE_REQUEST:
    case GET_PARTIAL_PROFILE_REQUEST:
    case MODIFY_PROFILE_REQUEST:
      return update(state, {
        spinnerClass: { $set: "spinner__show" },
        error: { $set: null }
      });

    case VALIDATE_TOKEN_SUCCESS:
    case GET_PROFILE_SUCCESS:
    case GET_PARTIAL_PROFILE_SUCCESS:
    case MODIFY_PROFILE_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        profile: { $set: action.payload.user },
        error: { $set: null }
      });

    case VALIDATE_TOKEN_FAILURE:
    case GET_PROFILE_FAILURE:
    case GET_PARTIAL_PROFILE_FAILURE:
    case MODIFY_PROFILE_FAILURE:
      console.log(action.payload);
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      console.log(error);
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        error: { $set: error }
      });

    default:
      return state;
  }
}

export default profile;
