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
  SEARCH_BOOK_REQUEST,
  SEARCH_BOOK_SUCCESS,
  SEARCH_BOOK_FAILURE,
  ADD_BOOK_REQUEST,
  ADD_BOOK_SUCCESS,
  ADD_BOOK_FAILURE,
  UPDATE_BOOK_OWNER_REQUEST,
  UPDATE_BOOK_OWNER_SUCCESS,
  UPDATE_BOOK_OWNER_FAILURE,
  UPDATE_BOOKLIST_SUCCESS
} from "../actions/apiBookActions";

const INITIAL_STATE = {
  loading: false,
  books: [],
  searchResults: [],
  currentBook: {
    _id: "",
    title: "",
    authors: [],
    description: "",
    owner: "",
    published: "",
    thumbnail: ""
  },
  loggedInUserBooks: [],
  error: null
};

function book(state = INITIAL_STATE, action) {
  let error;

  switch (action.type) {
    case GET_ALL_BOOKS_REQUEST:
    case GET_BOOK_BY_ID_REQUEST:
    case GET_USER_BOOKS_REQUEST:
    case SEARCH_BOOK_REQUEST:
    case ADD_BOOK_REQUEST:
    case UPDATE_BOOK_OWNER_REQUEST:
      return update(state, {
        loading: { $set: true },
        error: { $set: null }
      });

    case GET_ALL_BOOKS_SUCCESS:
      return update(state, {
        loading: { $set: false },
        books: { $set: action.payload.books },
        error: { $set: null }
      });

    case GET_USER_BOOKS_SUCCESS:
      console.log("get user books success");
      console.log(action.payload.books);
      return update(state, {
        loading: { $set: false },
        loggedInUserBooks: { $set: action.payload.books },
        error: { $set: null }
      });

    case UPDATE_BOOKLIST_SUCCESS:
      return update(state, {
        loading: { $set: false },
        books: { $set: action.payload.books },
        error: { $set: null }
      });

    case SEARCH_BOOK_SUCCESS:
      return update(state, {
        loading: { $set: false },
        searchResults: { $set: action.payload.books },
        error: { $set: null }
      });

    case GET_BOOK_BY_ID_SUCCESS:
    case ADD_BOOK_SUCCESS:
    case UPDATE_BOOK_OWNER_SUCCESS:
      return update(state, {
        loading: { $set: false },
        currentBook: { $set: action.payload.book },
        error: { $set: null }
      });

    case GET_ALL_BOOKS_FAILURE:
    case GET_BOOK_BY_ID_FAILURE:
    case GET_USER_BOOKS_FAILURE:
    case SEARCH_BOOK_FAILURE:
    case ADD_BOOK_FAILURE:
    case UPDATE_BOOK_OWNER_FAILURE:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return update(state, {
        loading: { $set: false },
        error: { $set: error }
      });

    default:
      return state;
  }
}

export default book;
