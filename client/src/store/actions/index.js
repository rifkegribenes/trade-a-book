export const LOGOUT = "LOGOUT";
export const SET_LOGGEDIN = "SET_LOGGEDIN";
export const SET_REDIRECT_URL = "SET_REDIRECT_URL";
export const SET_SPINNER = "SET_SPINNER";
export const SET_MENU_STATE = "SET_MENU_STATE";
export const SET_ADMIN_MENU_STATE = "SET_ADMIN_MENU_STATE";
export const SET_WINDOW_SIZE = "SET_WINDOW_SIZE";

export function logout() {
  return {
    type: LOGOUT
  };
}

export function setLoggedIn(user) {
  return {
    type: SET_LOGGEDIN,
    payload: user
  };
}

export function setRedirectUrl(url) {
  return {
    type: SET_REDIRECT_URL,
    payload: url
  };
}

export function setSpinner(spinnerClass) {
  return {
    type: SET_SPINNER,
    payload: spinnerClass
  };
}

export function setMenuState(menu) {
  return {
    type: SET_MENU_STATE,
    payload: menu
  };
}

export function setAdminMenuState(menu) {
  return {
    type: SET_ADMIN_MENU_STATE,
    payload: menu
  };
}

export function setWindowSize(size) {
  return {
    type: SET_WINDOW_SIZE,
    payload: size
  };
}
