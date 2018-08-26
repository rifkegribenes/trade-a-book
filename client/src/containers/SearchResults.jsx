import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiBookActions from "../store/actions/apiBookActions";

import Notifier, { openSnackbar } from "./Notifier";
import BookList from "../components/BookList";

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
    const token = this.props.appState.authToken;
    const userId = this.props.profile.profile._id;
    if (!this.props.appState.loggedIn || !userId || !token) {
      openSnackbar("error", "Please log in to add a book");
      return;
    }

    if (book) {
      book.owner = userId;
      this.props.apiBook
        .addBook(token, book)
        .then(result => {
          openSnackbar("success", `Added ${book.title} to your library.`);
          this.props.clearSearch();
        })
        .catch(err => openSnackbar("error", err));
    } else {
      openSnackbar("error", "Sorry, no books found.");
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
        <BookList
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

SearchResults.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }),
  book: PropTypes.shape({
    searchResults: PropTypes.array
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string
    })
  }),
  classes: PropTypes.object,
  apiBook: PropTypes.shape({
    getAllBooks: PropTypes.func,
    addBook: PropTypes.func
  }),
  clearSearch: PropTypes.func
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  book: state.book
});

const mapDispatchToProps = dispatch => ({
  apiBook: bindActionCreators(apiBookActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SearchResults)
  )
);
