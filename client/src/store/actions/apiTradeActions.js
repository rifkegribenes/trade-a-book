import { RSAA } from "redux-api-middleware";
import BASE_URL from "./apiConfig.js";

export const GET_USER_TRADES_REQUEST = "GET_USER_TRADES_REQUEST";
export const GET_USER_TRADES_SUCCESS = "GET_USER_TRADES_SUCCESS";
export const GET_USER_TRADES_FAILURE = "GET_USER_TRADES_FAILURE";
export const PROPOSE_TRADE_REQUEST = "PROPOSE_TRADE_REQUEST";
export const PROPOSE_TRADE_SUCCESS = "PROPOSE_TRADE_SUCCESS";
export const PROPOSE_TRADE_FAILURE = "PROPOSE_TRADE_FAILURE";
export const UPDATE_TRADE_REQUEST = "UPDATE_TRADE_REQUEST";
export const UPDATE_TRADE_SUCCESS = "UPDATE_TRADE_SUCCESS";
export const UPDATE_TRADE_FAILURE = "UPDATE_TRADE_FAILURE";
// export const UPDATE_TRADELIST_SUCCESS = "UPDATE_TRADELIST_SUCCESS";

// export function updateTradeList(trades) {
//   console.log(trades);
//   return {
//     type: UPDATE_TRADELIST_SUCCESS,
//     payload: { trades }
//   };
// }

/*
* Function: getUserTrades -- get all trades for a given user
* @param {string} userId
* This action dispatches additional actions as it executes:
*   GET_USER_TRADES_REQUEST:
*     Initiates a spinner on the home page.
*   GET_USER_TRADES_SUCCESS:
*     If array of trades successfully retrieved, hides spinner
*   GET_USER_TRADES_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function getUserTrades(userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/trade/usertrades/${userId}`,
      method: "GET",
      types: [
        GET_USER_TRADES_REQUEST,
        GET_USER_TRADES_SUCCESS,
        {
          type: GET_USER_TRADES_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: proposeTrade -- add new trade to db
* @param {string} toUser (userId)
* @param {string} fromUser (userId)
* @param {string} bookRequested (bookId)
* @param {string} bookOffered (bookId)
* This action dispatches additional actions as it executes:
*   PROPOSE_TRADE_REQUEST:
*     Initiates a spinner on the home page.
*   PROPOSE_TRADE_SUCCESS:
*     If trade successfully retrieved, hides spinner
*   PROPOSE_TRADE_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function proposeTrade(token, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/trade/new`,
      method: "PUT",
      types: [
        PROPOSE_TRADE_REQUEST,
        PROPOSE_TRADE_SUCCESS,
        {
          type: PROPOSE_TRADE_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}

/*
* Function: updateTrade -- changes status of trade
* @param {string} tradeId
* @param {string} userId
* @param {string} status
* This action dispatches additional actions as it executes:
*   UPDATE_TRADE_REQUEST:
*     Initiates a spinner on the home page.
*   UPDATE_TRADE_SUCCESS:
*     If trade successfully retrieved, hides spinner
*   UPDATE_TRADE_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function updateTrade(token, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/trade/update`,
      method: "PUT",
      types: [
        UPDATE_TRADE_REQUEST,
        UPDATE_TRADE_SUCCESS,
        {
          type: UPDATE_TRADE_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}
