import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";
import { BASE_URL } from "../store/actions/apiConfig.js";

import BookListModular from "./BookListModular";
import Notifier, { openSnackbar } from "./Notifier";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

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
    if (!this.props.appState.loggedIn) {
      console.log("opening snackbar");
      const loginButton = props => (
        <Button
          key="login"
          size="small"
          className={props.classes.button}
          onClick={props.onClose}
          href={`${BASE_URL}/api/auth/google`}
        >
          Login
        </Button>
      );
      openSnackbar("error", "Please log in to view your library", loginButton);
    }
    const userId = this.props.profile.profile._id;
    const book = JSON.parse(window.localStorage.getItem("book"));
    if (book) {
      // if user was redirected to login after trying to add a book
      // retrieve that book from localStorage, add it to the user's library
      book.owner = userId;
      const token = this.props.appState.authToken;
      this.props.apiBook
        .addBook(token, book)
        .then(result => {
          console.log(result);
          openSnackbar("success", `Added ${book.title} to your library.`);
          this.props.apiBook
            .getUserBooks(userId)
            .then(result => console.log(this.props.book.books));
        })
        .catch(err => console.log(err));
      // then remove stored book from localStorage
      window.localStorage.removeItem("book");
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
    return (
      <div className="bookList">
        <Notifier />
        {this.props.appState.loggedIn && (
          <BookListModular
            listType="user"
            loggedIn={this.props.appState.loggedIn}
            title={`${this.props.profile.profile.firstName}'s Library`}
            books={this.props.book.books}
            removeBook={this.removeBook}
            classes={this.props.classes}
          />
        )}
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
