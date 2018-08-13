import { combineReducers } from "redux";
import appState from "../reducers/appState";
import profile from "../reducers/profile";
import book from "../reducers/book";
import trade from "../reducers/trade";

const rootReducer = combineReducers({
  appState,
  profile,
  book,
  trade
});

export default rootReducer;
