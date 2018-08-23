import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import BookList from "./BookList";
import Notifier, { openSnackbar } from "./Notifier";

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
  state = {
    dialogOpen: false
  };

  componentDidMount() {
    if (!this.props.appState.loggedIn) {
      openSnackbar("error", "Please log in to view your library");
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
          if (result.type === "ADD_BOOK_SUCCESS") {
            openSnackbar("success", `Added ${book.title} to your library.`);
            this.props.apiBook
              .getUserBooks(userId)
              .then(result => console.log(this.props.book.books))
              .catch(err => {
                console.log(err);
                openSnackbar("error", err);
              });
          } else {
            openSnackbar("error", this.props.book.error);
          }
        })
        .catch(err => {
          console.log(err);
          openSnackbar("error", err);
        });
      // then remove stored book from localStorage
      window.localStorage.removeItem("book");
      return;
    }

    this.props.apiBook
      .getUserBooks(userId)
      .then(result => {})
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  }

  removeBook = bookData => {
    console.log("removeBook");
    const token = this.props.appState.authToken;
    const userId = this.props.profile.profile._id;
    this.props.apiBook
      .removeBook(token, bookData._id)
      .then(result => {
        if (result.type === "REMOVE_BOOK_SUCCESS") {
          openSnackbar(
            "success",
            `Removed ${bookData.title} from your library.`
          );
          this.props.apiBook
            .getUserBooks(userId)
            .then(result => console.log(this.props.book.books))
            .catch(err => {
              console.log(err);
              openSnackbar("error", err);
            });
        } else {
          openSnackbar("error", this.props.book.error);
        }
      })
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  };

  handleOpen = book => {
    if (book) {
      if (!this.props.appState.loggedIn) {
        openSnackbar("error", "Please log in to propose a trade");
        return;
      }
    }
    this.setState({ dialogOpen: true });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    return (
      <div className="bookList">
        <Notifier />
        {this.props.appState.loggedIn && (
          <BookList
            listType="user"
            loggedIn={this.props.appState.loggedIn}
            title={`${this.props.profile.profile.firstName}'s Library`}
            books={this.props.book.loggedInUserBooks}
            removeBook={this.removeBook}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            open={this.state.dialogOpen}
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
