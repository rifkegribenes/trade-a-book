import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import BookListModular from "./BookListModular";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  button: {
    margin: theme.spacing.unit,
    flex: "0 0 auto"
  },
  rightIcon: {},
  author: {},
  owner: {
    display: "flex"
  }
});

class UserBooks extends Component {
  componentDidMount() {
    const userId = this.props.profile.profile._id;
    if (!this.props.appState.loggedIn || !userId) {
      console.log("not logged in");
      alert("you must be logged in to view user books... handle this error...");
      return;
    }
    this.props.apiBook
      .getUserBooks(userId)
      .then(result => {
        console.log("user books:");
        console.log(this.props.book.books);
      })
      .catch(err => console.log(err));
  }

  removeBook = bookData => {
    console.log("removeBook");
  };

  render() {
    console.log(this.props.book.books);
    return (
      <div className="bookList">
        <BookListModular
          listType="user"
          loggedIn={this.props.appState.loggedIn}
          title={`${this.props.profile.profile.firstName}'s Library`}
          books={this.props.book.books}
          removeBook={this.removeBook}
          classes={this.props.classes}
        />
      </div>
    );
  }
}
UserBooks.propTypes = {};

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
    )(UserBooks)
  )
);
