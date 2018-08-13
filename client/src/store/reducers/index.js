import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import appState from "../reducers/appState";
import auth from "../reducers/auth";
import profile from "../reducers/profile";
import book from "../reducers/book";
import trade from "../reducers/trade";

const rootReducer = combineReducers({
  appState,
  auth,
  profile,
  book,
  trade,
  toastr: toastrReducer
});

export default rootReducer;
