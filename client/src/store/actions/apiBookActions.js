import { RSAA } from "redux-api-middleware";
import BASE_URL from "./apiConfig.js";

export const GET_ALL_BOOKS_REQUEST = "GET_ALL_BOOKS_REQUEST";
export const GET_ALL_BOOKS_SUCCESS = "GET_ALL_BOOKS_SUCCESS";
export const GET_ALL_BOOKS_FAILURE = "GET_ALL_BOOKS_FAILURE";
export const GET_BOOK_BY_ID_REQUEST = "GET_BOOK_BY_ID_REQUEST";
export const GET_BOOK_BY_ID_SUCCESS = "GET_BOOK_BY_ID_SUCCESS";
export const GET_BOOK_BY_ID_FAILURE = "GET_BOOK_BY_ID_FAILURE";
export const GET_USER_BOOKS_REQUEST = "GET_USER_BOOKS_REQUEST";
export const GET_USER_BOOKS_SUCCESS = "GET_USER_BOOKS_SUCCESS";
export const GET_USER_BOOKS_FAILURE = "GET_USER_BOOKS_FAILURE";
export const ADD_BOOK_REQUEST = "ADD_BOOK_REQUEST";
export const ADD_BOOK_SUCCESS = "ADD_BOOK_SUCCESS";
export const ADD_BOOK_FAILURE = "ADD_BOOK_FAILURE";
export const UPDATE_BOOK_OWNER_REQUEST = "UPDATE_BOOK_OWNER_REQUEST";
export const UPDATE_BOOK_OWNER_SUCCESS = "UPDATE_BOOK_OWNER_SUCCESS";
export const UPDATE_BOOK_OWNER_FAILURE = "UPDATE_BOOK_OWNER_FAILURE";

/*
* Function: getAllBooks -- return all books
* This action dispatches additional actions as it executes:
*   GET_ALL_BOOKS_REQUEST:
*     Initiates spinner
*   GET_ALL_BOOKS_SUCCESS:
*     If books array successfully retrieved, hides spinner
*   GET_ALL_BOOKS_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function getAllBooks() {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/book/allbooks`,
      method: "GET",
      types: [
        GET_ALL_BOOKS_REQUEST,
        GET_ALL_BOOKS_SUCCESS,
        {
          type: GET_ALL_BOOKS_FAILURE,
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
* Function: getBookById -- get a single book by bookId
* @param {string} bookId
* This action dispatches additional actions as it executes:
*   GET_BOOK_BY_ID_REQUEST:
*     Initiates a spinner on the home page.
*   GET_BOOK_BY_ID_SUCCESS:
*     If book successfully retrieved, hides spinner
*   GET_BOOK_BY_ID_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function getBookById(bookId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/book/${bookId}`,
      method: "GET",
      types: [
        GET_BOOK_BY_ID_REQUEST,
        GET_BOOK_BY_ID_SUCCESS,
        {
          type: GET_BOOK_BY_ID_FAILURE,
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
* Function: getUserBooks -- get all books for a given user
* @param {string} userId
* This action dispatches additional actions as it executes:
*   GET_USER_BOOKS_REQUEST:
*     Initiates a spinner on the home page.
*   GET_USER_BOOKS_SUCCESS:
*     If array of books successfully retrieved, hides spinner
*   GET_USER_BOOKS_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function getUserBooks(userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/book/userbooks/${userId}`,
      method: "GET",
      types: [
        GET_USER_BOOKS_REQUEST,
        GET_USER_BOOKS_SUCCESS,
        {
          type: GET_USER_BOOKS_FAILURE,
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
* Function: addBook -- fetch book info from google books api by title and add new book to db
* @param {string} userId
* @param {string} title
* This action dispatches additional actions as it executes:
*   ADD_BOOK_REQUEST:
*     Initiates a spinner on the home page.
*   ADD_BOOK_SUCCESS:
*     If book successfully retrieved, hides spinner
*   ADD_BOOK_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function addBook(token, userId, title) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/book/new/${userId}/${title}`,
      method: "PUT",
      types: [
        ADD_BOOK_REQUEST,
        ADD_BOOK_SUCCESS,
        {
          type: ADD_BOOK_FAILURE,
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
      headers: { Authorization: `Bearer ${token}` }
    }
  };
}

/*
* Function: updateBookOwner -- changes ownership of book after completed trade
* @param {string} userId
* @param {string} title
* This action dispatches additional actions as it executes:
*   UPDATE_BOOK_OWNER_REQUEST:
*     Initiates a spinner on the home page.
*   UPDATE_BOOK_OWNER_SUCCESS:
*     If book successfully retrieved, hides spinner
*   UPDATE_BOOK_OWNER_FAILURE:
*     If database error, hides spinner, displays error toastr
*/
export function updateBookOwner(token, userId, bookId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/book/update/${userId}/${bookId}`,
      method: "PUT",
      types: [
        UPDATE_BOOK_OWNER_REQUEST,
        UPDATE_BOOK_OWNER_SUCCESS,
        {
          type: UPDATE_BOOK_OWNER_FAILURE,
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
      headers: { Authorization: `Bearer ${token}` }
    }
  };
}
