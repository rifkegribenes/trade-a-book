import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";
import * as apiTradeActions from "../store/actions/apiTradeActions";

import BookList from "../components/BookList";
import AlertDialog from "../components/AlertDialog";
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
    flex: "0 0 auto",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 7,
      top: 20,
      flex: "1 1 auto"
    }
  },
  owner: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
      padding: "0 10px"
    }
  },
  offered: {
    [theme.breakpoints.down("sm")]: {
      padding: 0
    }
  },
  contentBold: {
    fontWeight: "bold"
  },
  container: {
    width: "100%",
    height: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: 40
  },
  item: {
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap"
    }
  },
  bookInfo: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "0 10px"
    }
  },
  avatar: {
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 20,
      bottom: 15
    }
  }
});

class AllBooks extends Component {
  state = {
    tradeDialogOpen: false,
    alertDialogOpen: false,
    bookOffered: {},
    bookRequested: {}
  };

  handleTradeDialogOpen = bookRequested => {
    const newState = { ...this.state };
    newState.tradeDialogOpen = true;
    newState.bookRequested = { ...bookRequested };
    this.setState({ ...newState });
  };

  handleAlertDialogOpen = () => {
    const newState = { ...this.state };
    newState.alertDialogOpen = true;
    this.setState({ ...newState });
  };

  cancel = () => {
    const newState = { ...this.state };
    newState.alertDialogOpen = false;
    newState.tradeDialogOpen = false;
    this.setState({ ...newState });
  };

  handleTradeDialogClose = (bookRequested, bookOffered) => {
    const newState = { ...this.state };
    newState.bookOffered = bookOffered;
    newState.bookRequested = bookRequested;
    newState.tradeDialogOpen = false;
    newState.alertDialogOpen = true;
    this.setState({ ...newState });
  };

  handleAlertDialogClose = () => {
    const newState = { ...this.state };
    newState.alertDialogOpen = false;
    this.setState({ ...newState });
  };

  componentDidMount() {
    const userId = this.props.profile.profile._id;
    const bookListPromise = books => {
      // filter out books owned by logged-inn user
      return (
        books
          .filter(book => book.owner.toString() !== userId.toString())
          // then map through booklist and
          // return partial profile data for book owner
          .map(book => {
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
          })
      );
    };

    // fetch all book data from Mongo
    this.props.apiBook.getAllBooks().then(result => {
      // then for each book fetch owner data
      Promise.all(bookListPromise(this.props.book.books))
        .then(bookList => {
          // and save enriched list to redux booklist
          this.props.apiBook.updateBooklist(bookList);
        })
        .catch(err => console.log(err));
    });
  }

  proposeTrade = (bookRequested, bookOffered) => {
    const token = this.props.appState.authToken;
    const body = {
      bookRequested,
      bookOffered,
      fromUser: {
        _id: this.props.profile.profile._id,
        firstName: this.props.profile.profile.firstName,
        avatarUrl: this.props.profile.profile.avatarUrl
      },
      toUser: {
        _id: bookRequested.owner,
        firstName: bookRequested.ownerData.firstName,
        avatarUrl: bookRequested.ownerData.avatarUrl
      }
    };
    this.props.apiTrade
      .proposeTrade(token, body)
      .then(result => {
        if (result.type === "PROPOSE_TRADE_SUCCESS") {
          openSnackbar(
            "success",
            `If this were a real app, a message would be sent to ${
              bookRequested.ownerData.firstName
            } proposing this trade.`
          );
        } else {
          openSnackbar("error", this.props.trade.error);
        }
      })
      .catch(err => openSnackbar("error", err));
  };

  render() {
    return (
      <div className="bookList">
        <Notifier />
        {this.state.alertDialogOpen && (
          <AlertDialog
            handleClose={this.handleAlertDialogClose}
            open={this.state.alertDialogOpen}
            title="Confirm your proposal"
            content={`Clicking Propose Trade will send a message to ${
              this.state.bookRequested.ownerData.firstName
            } offering to trade your copy of ${
              this.state.bookOffered.title
            } for their copy of ${this.state.bookRequested.title}.`}
            action={() => {
              this.proposeTrade(
                this.state.bookRequested,
                this.state.bookOffered
              );
              this.handleAlertDialogClose();
            }}
            buttonText="Propose Trade"
          />
        )}
        <BookList
          listType="all"
          loggedIn={this.props.appState.loggedIn}
          title="All books available for trade"
          subhead="Click arrows to propose a trade"
          tradeDialogOpen={this.state.tradeDialogOpen}
          handleTradeDialogOpen={this.handleTradeDialogOpen}
          handleTradeDialogClose={this.handleTradeDialogClose}
          cancel={this.cancel}
          bookRequested={this.state.bookRequested}
          books={this.props.book.books}
          classes={this.props.classes}
          userId={this.props.profile.profile._id}
        />
      </div>
    );
  }
}

AllBooks.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }),
  book: PropTypes.shape({
    books: PropTypes.array
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string,
      firstName: PropTypes.string,
      avatarUrl: PropTypes.string
    }),
    partialProfile: PropTypes.shape({
      _id: PropTypes.string,
      firstName: PropTypes.string,
      avatarUrl: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string
    })
  }),
  trade: PropTypes.shape({
    error: PropTypes.string
  }),
  classes: PropTypes.object,
  apiProfile: PropTypes.shape({
    getPartialProfile: PropTypes.func
  }),
  apiBook: PropTypes.shape({
    getAllBooks: PropTypes.func,
    updateBooklist: PropTypes.func
  }),
  apiTrade: PropTypes.shape({
    proposeTrade: PropTypes.func
  })
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  book: state.book,
  trade: state.trade
});

const mapDispatchToProps = dispatch => ({
  apiBook: bindActionCreators(apiBookActions, dispatch),
  apiProfile: bindActionCreators(apiProfileActions, dispatch),
  apiTrade: bindActionCreators(apiTradeActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(AllBooks)
  )
);
