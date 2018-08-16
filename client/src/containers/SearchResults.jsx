import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";
import { BASE_URL } from "../store/actions/apiConfig.js";
import Notifier, { openSnackbar } from "./Notifier";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import AddBox from "@material-ui/icons/AddBox";
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

  addBook = bookData => {
    console.log("addBook");
    console.log(bookData);
    const token = this.props.appState.authToken;
    const userId = this.props.profile.profile._id;
    if (!this.props.appState.loggedIn || !userId || !token) {
      alert("you must be logged in to add a book... handle this error...");
      return;
    }

    const book = {
      googleId: bookData.id,
      title: bookData.volumeInfo.title,
      authors: [...bookData.volumeInfo.authors],
      owner: userId,
      published: bookData.volumeInfo.publishedDate,
      thumbnail: bookData.volumeInfo.imageLinks.thumbnail
    };

    if (book) {
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

  render() {
    const { classes } = this.props;
    const { loggedIn } = this.props.appState;
    return (
      <div className="searchResults">
        <Notifier />
        <Paper>
          <Typography variant="display1" align="center" gutterBottom>
            Search Results
          </Typography>
          <Typography variant="subheading" align="center" gutterBottom>
            Choose your book from the results and click 'Add' to add to your
            library.
          </Typography>
          <List style={{ maxWidth: 600 }}>
            {this.props.book.searchResults.map((book, i, books) => (
              <div key={book.id}>
                <ListItem style={{ paddingRight: 0, paddingLeft: 0 }}>
                  <img
                    className={classes.thumbnail}
                    style={{ height: "80px", padding: 10 }}
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                  />
                  <ListItemText
                    primary={book.volumeInfo.title}
                    secondary={`${book.volumeInfo.authors.join(
                      ", "
                    )} (${book.volumeInfo.publishedDate.substring(0, 4)})`}
                  />
                  {loggedIn ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="default"
                      className={classes.button}
                      onClick={() => this.addBook(book)}
                    >
                      Add
                      <AddBox className={classes.rightIcon} />
                    </Button>
                  ) : (
                    <a href={`${BASE_URL}/api/auth/google`}>
                      <Button
                        size="small"
                        variant="contained"
                        color="default"
                        className={classes.button}
                      >
                        Add
                        <AddBox className={classes.rightIcon} />
                      </Button>
                    </a>
                  )}
                </ListItem>
                {i < books.length - 1 ? <Divider light /> : null}
              </div>
            ))}
          </List>
        </Paper>
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
