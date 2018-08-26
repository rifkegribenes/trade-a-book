import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import PropTypes from "prop-types";

import CssBaseline from "@material-ui/core/CssBaseline";

import * as Actions from "./store/actions";
import * as apiBookActions from "./store/actions/apiBookActions";
import * as apiProfileActions from "./store/actions/apiProfileActions";

import NavBar from "./containers/NavBar";
import Home from "./components/Home";
import Profile from "./containers/Profile";
import Logout from "./containers/Logout";
import UserBooks from "./containers/UserBooks";
import UserTrades from "./containers/UserTrades";
import AddBook from "./containers/AddBook";
import AllBooks from "./containers/AllBooks";

class App extends Component {
  componentDidMount() {
    if (this.props.location.hash) {
      const hash = this.props.location.hash.slice(2);
      const url = `/${hash.split("=")[1]}`;
      this.props.history.push(url);
    }
    // If not logged in, check local storage for authToken
    // if it doesn't exist, it returns the string "undefined"
    if (!this.props.appState.loggedIn) {
      let token = window.localStorage.getItem("authToken");
      if (token && token !== "undefined") {
        token = JSON.parse(token);
        const userId = JSON.parse(window.localStorage.getItem("userId"));
        if (userId) {
          this.props.apiProfile.validateToken(token, userId).then(result => {
            if (result === "VALIDATE_TOKEN_FAILURE") {
              window.localStorage.clear();
            } else if (result === "VALIDATE_TOKEN_SUCESS") {
            }
          });
        }
      } else {
        // console.log("no token found in local storage");
      }
    } else {
      // console.log("logged in");
    }
  }

  render() {
    return (
      <div className="App">
        <CssBaseline />
        <NavBar />
        <main className="main" id="main">
          <Switch>
            <Route
              exact
              path="/"
              render={routeProps => <Home {...routeProps} />}
            />
            <Route
              path="/profile/:id?/:token?"
              render={routeProps => <Profile {...routeProps} />}
            />
            <Route
              path="/library"
              render={routeProps => <UserBooks {...routeProps} />}
            />
            <Route
              path="/trades"
              render={routeProps => <UserTrades {...routeProps} />}
            />
            <Route
              path="/new"
              render={routeProps => <AddBook {...routeProps} />}
            />
            <Route
              path="/all"
              render={routeProps => <AllBooks {...routeProps} />}
            />
            <Route path="/logout" component={Logout} />
            {/*            <Route path="*" component={NotFound} />*/}
          </Switch>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  book: state.book
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  apiBook: bindActionCreators(apiBookActions, dispatch),
  apiProfile: bindActionCreators(apiProfileActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
