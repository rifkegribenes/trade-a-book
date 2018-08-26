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
  loading: false,
  profile: {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    avatarUrl: "",
    city: "",
    state: ""
  },
  partialProfile: {
    firstName: "",
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
    case MODIFY_PROFILE_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        profile: {
          _id: { $set: action.payload.user._id },
          firstName: { $set: action.payload.user.profile.firstName },
          lastName: { $set: action.payload.user.profile.lastName },
          email: { $set: action.payload.user.google.email },
          avatarUrl: { $set: action.payload.user.profile.avatarUrl },
          city: { $set: action.payload.user.profile.city },
          state: { $set: action.payload.user.profile.state }
        },
        error: { $set: null }
      });

    case GET_PARTIAL_PROFILE_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        partialProfile: {
          firstName: { $set: action.payload.firstName },
          avatarUrl: { $set: action.payload.avatarUrl },
          city: { $set: action.payload.city },
          state: { $set: action.payload.state }
        },
        error: { $set: null }
      });

    case VALIDATE_TOKEN_FAILURE:
    case GET_PROFILE_FAILURE:
    case GET_PARTIAL_PROFILE_FAILURE:
    case MODIFY_PROFILE_FAILURE:
      console.log(action.type);
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
