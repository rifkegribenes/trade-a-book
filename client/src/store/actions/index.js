export const LOGOUT = "LOGOUT";
export const SET_LOGGEDIN = "SET_LOGGEDIN";
export const SET_FORM_FIELD = "SET_FORM_FIELD";
export const SET_FORM_ERROR = "SET_FORM_ERROR";
export const SET_VALIDATION_ERRORS = "SET_VALIDATION_ERRORS";
export const RESET_FORM = "RESET_FORM";
export const SHOW_FORM_ERROR = "SHOW_FORM_ERROR";
export const SET_TOUCHED = "SET_TOUCHED";
export const SET_SHOW_ERROR = "SET_SHOW_ERROR";
export const SET_SUBMIT = "SET_SUBMIT";
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

export function setFormField(id, value) {
  return {
    type: SET_FORM_FIELD,
    payload: {
      id,
      value
    }
  };
}

export function setFormError(msg) {
  return {
    type: SET_FORM_ERROR,
    payload: msg
  };
}

export function setValidationErrors(errors) {
  return {
    type: SET_VALIDATION_ERRORS,
    payload: { ...errors }
  };
}

export function resetForm() {
  return {
    type: RESET_FORM
  };
}

export function showFormError(bool) {
  return {
    type: SHOW_FORM_ERROR,
    payload: bool
  };
}

export function setTouched(name) {
  return {
    type: SET_TOUCHED,
    payload: name
  };
}

export function setShowError(name, bool) {
  return {
    type: SET_SHOW_ERROR,
    payload: { name, bool }
  };
}

export function setSubmit() {
  return {
    type: SET_SUBMIT
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
