import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import BookList from "../components/BookList";
import Notifier, { openSnackbar } from "./Notifier";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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
  },
  message: {
    margin: "auto",
    width: "50%",
    textAlign: "center",
    height: "50%",
    lineHeight: "2em"
  },
  container: {
    width: "100%",
    height: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: 40
  }
});

class UserBooks extends Component {
  state = {
    dialogOpen: false
  };

  componentDidMount() {
    if (this.props.profile.profile._id) {
      this.getUserBooks();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profile.profile._id !== this.props.profile.profile._id) {
      this.getUserBooks();
    }
  }

  getUserBooks = () => {
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
  };

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
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Notifier />
        {this.props.book.loggedInUserBooks.length ? (
          <BookList
            listType="user"
            loggedIn={this.props.appState.loggedIn}
            title={`${this.props.profile.profile.firstName}'s Library`}
            books={this.props.book.loggedInUserBooks}
            removeBook={this.removeBook}
            handleAlertDialogOpen={this.handleOpen}
            handleAlertDialogClose={this.handleClose}
            alertDialogOpen={this.state.dialogOpen}
            classes={classes}
          />
        ) : (
          <div className={classes.container}>
            <Typography className={classes.message}>
              Your library is empty! <br />
              <Link to="/new">Add some books</Link> to get started.
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

UserBooks.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }),
  book: PropTypes.shape({
    error: PropTypes.string,
    books: PropTypes.array,
    loggedInUserBooks: PropTypes.array
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string,
      firstName: PropTypes.string
    })
  }),
  classes: PropTypes.object,
  apiBook: PropTypes.shape({
    getUserBooks: PropTypes.func,
    addBook: PropTypes.func
  })
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  book: state.book
});

const mapDispatchToProps = dispatch => ({
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
