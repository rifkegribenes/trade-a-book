import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import PropTypes from "prop-types";

import * as Actions from "./store/actions";
import * as apiBookActions from "./store/actions/apiBookActions";

import NavBar from "./containers/NavBar";
import Home from "./containers/Home";
import Profile from "./containers/Profile";
import Logout from "./containers/Logout";

class App extends Component {
  componentDidMount() {
    if (this.props.location.hash) {
      console.log("redirect hash client");
      const hash = this.props.location.hash.slice(2);
      const url = `/${hash.split("=")[1]}`;
      // don't redirect for facebook hash after social auth
      if (url !== "/_") {
        this.props.history.push(url);
      }
    }
  }
  render() {
    return (
      <div className="App">
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
  apiBook: bindActionCreators(apiBookActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
