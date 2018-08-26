import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiBookActions from "../store/actions/apiBookActions";

import Search from "../components/Search";
import SearchResults from "./SearchResults";
import Notifier, { openSnackbar } from "./Notifier";

import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 400
  },
  form: {
    margin: "auto",
    width: "100%",
    maxWidth: 600,
    height: 92,
    paddingBottom: 20,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  button: {
    flex: "0 0 auto"
  },
  input: {
    marginRight: 20
  }
};

class AddBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      author: ""
    };
  }

  handleInput = ({ target: { name, value } }) =>
    this.setState({
      [name]: value
    });

  searchBook = () => {
    const title = encodeURIComponent(this.state.title);
    const author = encodeURIComponent(this.state.author);

    if (title && author) {
      this.props.apiBook
        .searchBook(title, author)
        .then(result => {
          if (result === "SEARCH_BOOK_FAILURE" || this.props.book.error) {
            openSnackbar("error", "Sorry, book not found.");
          }
        })
        .catch(err => openSnackbar("error", err));
    } else {
      openSnackbar("error", "Please enter a title and author to search.");
    }
  };

  clearSearch = () => {
    this.props.apiBook.clearSearchResults();
    this.setState({
      title: "",
      author: ""
    });
  };

  render() {
    return (
      <div className="addBook">
        <Notifier />
        <Search
          title={this.state.title}
          author={this.state.author}
          handleInput={this.handleInput}
          searchBook={this.searchBook}
          classes={this.props.classes}
          book={this.props.book}
        />
        {this.props.book.searchResults.length ? (
          <SearchResults clearSearch={this.clearSearch} />
        ) : null}
      </div>
    );
  }
}

AddBook.propTypes = {
  book: PropTypes.shape({
    searchResults: PropTypes.array
  }),
  apiBook: PropTypes.shape({
    clearSearchResults: PropTypes.func,
    searchBook: PropTypes.func
  })
};

const mapStateToProps = state => ({
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
    )(AddBook)
  )
);
