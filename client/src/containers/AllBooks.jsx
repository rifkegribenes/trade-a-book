import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import BookList from "./BookList";
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
  state = {
    dialogOpen: false,
    selectedBook: {}
  };

  handleOpen = () => {
    this.setState({
      dialogOpen: true
    });
  };

  handleClose = bookData => {
    this.setState({ selectedBook: bookData, dialogOpen: false });
  };

  componentDidMount() {
    const bookListPromise = books => {
      return books.map(book => {
        return this.props.apiProfile
          .getPartialProfile(book.owner)
          .then(() => {
            const ownerData = {
              firstName: this.props.profile.partialProfile.firstName,
              avatarUrl: this.props.profile.partialProfile.avatarUrl,
              city: this.props.profile.partialProfile.city,
              state: this.props.profile.partialProfile.state,
              _id: this.props.profile.partialProfile._id
            };
            return { ...book, ownerData };
          })
          .catch(err => console.log(err));
      });
    };

    // fetch all book data from Mongo
    this.props.apiBook.getAllBooks().then(result => {
      // then for each book fetch owner data
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
    console.log(bookData);
  };

  render() {
    return (
      <div className="bookList">
        <BookList
          listType="all"
          loggedIn={this.props.appState.loggedIn}
          title="All books available for trade"
          subhead=""
          dialogOpen={this.state.dialogOpen}
          handleOpen={this.handleOpen}
          handleClose={this.handleClose}
          selectedValue={this.state.selectedValue}
          books={this.props.book.books}
          proposeTrade={this.proposeTrade}
          classes={this.props.classes}
          userId={this.props.profile.profile._id}
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
