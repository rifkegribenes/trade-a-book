import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import Notifier, { openSnackbar } from "./Notifier";
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
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  author: {}
});

class SearchResults extends Component {
  componentDidMount() {}

  addBook = book => {
    console.log("addBook");
    console.log(book);
    const token = this.props.appState.authToken;
    const userId = this.props.profile.profile._id;
    if (!this.props.appState.loggedIn || !userId || !token) {
      alert("you must be logged in to add a book... handle this error...");
      return;
    }

    if (book) {
      book.owner = userId;
      this.props.apiBook
        .addBook(token, book)
        .then(result => {
          console.log(result);
          openSnackbar("success", `Added ${book.title} to your library.`);
          this.props.apiBook
            .getAllBooks()
            .then(result => console.log(this.props.book.books));
        })
        .catch(err => console.log(err));
    } else {
      // add client-side validation here
      console.log("handle this error client side...");
    }
  };

  setRedirect = book => {
    console.log(book);
    window.localStorage.setItem("redirect", "/library");
    window.localStorage.setItem("book", JSON.stringify(book));
  };

  render() {
    return (
      <div className="searchResults">
        <Notifier />
        <BookListModular
          listType="search"
          loggedIn={this.props.appState.loggedIn}
          title="Search Results"
          subhead="Choose your book from the results and click 'Add' to add to your library."
          books={this.props.book.searchResults}
          addBook={this.addBook}
          setRedirect={this.setRedirect}
          classes={this.props.classes}
        />
      </div>
    );
  }
}

SearchResults.propTypes = {};

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
    )(SearchResults)
  )
);
