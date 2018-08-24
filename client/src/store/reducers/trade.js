import update from "immutability-helper";

import {
  GET_USER_TRADES_REQUEST,
  GET_USER_TRADES_SUCCESS,
  GET_USER_TRADES_FAILURE,
  PROPOSE_TRADE_REQUEST,
  PROPOSE_TRADE_SUCCESS,
  PROPOSE_TRADE_FAILURE,
  UPDATE_TRADE_REQUEST,
  UPDATE_TRADE_SUCCESS,
  UPDATE_TRADE_FAILURE
  // UPDATE_TRADELIST_SUCCESS
} from "../actions/apiTradeActions";

const INITIAL_STATE = {
  loading: false,
  trades: [],
  currentTrade: {
    _id: "",
    fromUser: "",
    fromUserData: {
      firstName: "",
      avatarUrl: ""
    },
    toUser: "",
    toUserData: {
      firstName: "",
      avatarUrl: ""
    },
    bookRequested: "",
    bookRequestedData: {
      title: "",
      thumbnail: ""
    },
    bookOffered: "",
    bookOfferedData: {
      title: "",
      thumbnail: ""
    },
    status: "",
    createdAt: ""
  },
  error: null
};

function trade(state = INITIAL_STATE, action) {
  let error;

  switch (action.type) {
    case GET_USER_TRADES_REQUEST:
    case PROPOSE_TRADE_REQUEST:
    case UPDATE_TRADE_REQUEST:
      return update(state, {
        loading: { $set: true },
        error: { $set: null }
      });

    case GET_USER_TRADES_SUCCESS:
      return update(state, {
        loading: { $set: false },
        trades: { $set: action.payload.trades },
        error: { $set: null }
      });

    case PROPOSE_TRADE_SUCCESS:
    case UPDATE_TRADE_SUCCESS:
      return update(state, {
        loading: { $set: false },
        currentTrade: { $set: action.payload.trade },
        error: { $set: null }
      });

    // case UPDATE_TRADELIST_SUCCESS:
    //   console.log(action.payload.trades);
    //   return update(state, {
    //     loading: { $set: false },
    //     trades: { $set: action.payload.trades },
    //     error: { $set: null }
    //   });

    case GET_USER_TRADES_FAILURE:
    case PROPOSE_TRADE_FAILURE:
    case UPDATE_TRADE_FAILURE:
      console.log(action.payload);
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      console.log(error);
      return update(state, {
        loading: { $set: false },
        error: { $set: error }
      });

    default:
      return state;
  }
}

export default trade;
