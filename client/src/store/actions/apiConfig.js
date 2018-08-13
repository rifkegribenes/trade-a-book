/*
    Defines the base API connection URL
    Single source of truth used in multiple API actions.
*/

/* ================================= SETUP ================================= */

const prodUrl = "https://trade-a-book.herokuapp.com"; // NO TRAILING SLASH
const devUrl = "http://localhost:3001"; // server url for local install

/* ================================ EXPORTS ================================ */

// NODE_ENV is set by heroku when deployed

const BASE_URL = process.env.NODE_ENV === "production" ? prodUrl : devUrl;

export default BASE_URL;
