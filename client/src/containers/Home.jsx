import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Divider from "@material-ui/core/Divider";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import Search from "./Search";
import SearchResults from "./SearchResults";
import AllBooks from "./AllBooks";

import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 400
  }
};

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      currentBook: {},
      title: "",
      author: ""
    };
  }

  componentDidMount() {
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
              console.log("token failed to validate");
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
      <div className="Home">
        <Search />
        {this.props.book.searchResults.length ? <SearchResults /> : null}
        <Divider />
        <AllBooks />
      </div>
    );
  }
}

Home.propTypes = {};

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

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Home)
  )
);
