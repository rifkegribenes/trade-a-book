import update from "immutability-helper";

import {
  GET_ALL_BOOKS_REQUEST,
  GET_ALL_BOOKS_SUCCESS,
  GET_ALL_BOOKS_FAILURE,
  GET_BOOK_BY_ID_REQUEST,
  GET_BOOK_BY_ID_SUCCESS,
  GET_BOOK_BY_ID_FAILURE,
  GET_USER_BOOKS_REQUEST,
  GET_USER_BOOKS_SUCCESS,
  GET_USER_BOOKS_FAILURE,
  ADD_BOOK_REQUEST,
  ADD_BOOK_SUCCESS,
  ADD_BOOK_FAILURE,
  UPDATE_BOOK_OWNER_REQUEST,
  UPDATE_BOOK_OWNER_SUCCESS,
  UPDATE_BOOK_OWNER_FAILURE
} from "../actions/apiBookActions";

const INITIAL_STATE = {
  spinnerClass: "spinner__hide",
  books: [],
  currentBook: {
    title: "",
    authors: [],
    owner: "",
    published: "",
    thumbnail: ""
  }
};

function book(state = INITIAL_STATE, action) {
  let error;

  switch (action.type) {
    case GET_ALL_BOOKS_REQUEST:
    case GET_BOOK_BY_ID_REQUEST:
    case GET_USER_BOOKS_REQUEST:
    case ADD_BOOK_REQUEST:
    case UPDATE_BOOK_OWNER_REQUEST:
      return Object.assign({}, state, {
        spinnerClass: "spinner__show"
      });

    case GET_ALL_BOOKS_SUCCESS:
    case GET_USER_BOOKS_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        books: { $set: action.payload.books }
      });

    case GET_BOOK_BY_ID_SUCCESS:
    case ADD_BOOK_SUCCESS:
    case UPDATE_BOOK_OWNER_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        currentBook: { $set: action.payload.book }
      });

    case GET_ALL_BOOKS_FAILURE:
    case GET_BOOK_BY_ID_FAILURE:
    case GET_USER_BOOKS_FAILURE:
    case ADD_BOOK_FAILURE:
    case UPDATE_BOOK_OWNER_FAILURE:
      console.log(action.payload);
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      console.log(error);
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        errorMsg: error
      });

    default:
      return state;
  }
}

export default stock;
