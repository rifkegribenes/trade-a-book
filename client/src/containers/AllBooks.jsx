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

class AllBooks extends Component {
  componentDidMount() {
    const bookListPromise = books => {
      return books.map(book => {
        console.log(`getting partial profile for ${book.owner}`);
        return this.props.apiProfile
          .getPartialProfile(book.owner)
          .then(() => {
            const ownerData = {
              firstName: this.props.profile.partialProfile.firstName,
              avatarUrl: this.props.profile.partialProfile.avatarUrl,
              city: this.props.profile.partialProfile.city,
              state: this.props.profile.partialProfile.state
            };
            return { ...book, ownerData };
          })
          .catch(err => console.log(err));
      });
    };

    // fetch all book data from Mongo
    this.props.apiBook.getAllBooks().then(result => {
      // then for each book fetch user information
      Promise.all(bookListPromise(this.props.book.books))
        .then(bookList => {
          // and save this to redux booklist
          this.props.apiBook.updateBooklist(bookList);
        })
        .catch(err => console.log(err));
    });
  }

  proposeTrade = bookData => {
    console.log("proposeTrade");
  };

  render() {
    console.log(this.props.book.books);
    return (
      <div className="bookList">
        <BookListModular
          listType="all"
          loggedIn={this.props.appState.loggedIn}
          title="All books"
          subhead="Click to propose a trade."
          books={this.props.book.books}
          proposeTrade={this.proposeTrade}
          classes={this.props.classes}
        />
      </div>
    );
  }
}

AllBooks.propTypes = {};

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
    )(AllBooks)
  )
);
