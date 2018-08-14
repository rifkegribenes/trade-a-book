import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 400
  }
};

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      currentBook: {},
      title: "",
      author: ""
    };
  }

  componentDidMount() {
    // If not logged in, check local storage for authToken
    // if it doesn't exist, it returns the string "undefined"
    if (!this.props.appState.loggedIn) {
      let token = window.localStorage.getItem("authToken");
      if (token && token !== "undefined") {
        token = JSON.parse(token);
        const userId = JSON.parse(window.localStorage.getItem("userId"));
        if (userId) {
          this.props.apiProfile.validateToken(token, userId).then(result => {
            if (result === "VALIDATE_TOKEN_FAILURE") {
              console.log("token failed to validate");
            } else if (result === "VALIDATE_TOKEN_SUCESS") {
            }
          });
        }
      } else {
        // console.log("no token found in local storage");
      }
    } else {
      // console.log("logged in");
    }
    this.props.apiBook.getAllBooks().then(() => {
      console.log(this.props.book.books);
    });
  }

  handleInput = ({ target: { name, value } }) =>
    this.setState({
      [name]: value
    });

  searchBook = () => {
    console.log("searchBook");
    // const token = this.props.appState.authToken;
    // const userId = this.props.profile.profile._id;
    const title = encodeURIComponent(this.state.title);
    const author = encodeURIComponent(this.state.author);
    // const body = { userId, title, author };
    if (title && author) {
      console.log(title);
      this.props.apiBook
        .searchBook(title, author)
        .then(result => {
          console.log(result);
          console.log(this.props.book.searchResults);
        })
        .catch(err => console.log(err));
    } else {
      // add client-side validation here
      console.log("title and author are required");
    }
  };

  render() {
    const { title, author } = this.state;
    return (
      <div className="Home">
        <Paper>
          <Typography variant="display1" align="center" gutterBottom>
            Trade a book
          </Typography>
          <form onSubmit={this.addBook}>
            <TextField
              name="title"
              label="Title"
              value={title}
              onChange={this.handleInput}
              margin="normal"
            />
            <TextField
              name="author"
              label="Author"
              value={author}
              onChange={this.handleInput}
              margin="normal"
            />
            <Button
              type="button"
              color="primary"
              variant="raised"
              onClick={() => this.searchBook()}
            >
              Search book
            </Button>
          </form>
        </Paper>
        <List>
          {this.props.book.books && this.props.book.books.length
            ? this.props.book.books.map(({ _id, title }) => (
                <ListItem key={_id}>
                  <ListItemText primary={title} />
                </ListItem>
              ))
            : null}
        </List>
        <List>
          {this.props.book.searchResults.length &&
            this.props.book.searchResults.map(book => (
              <ListItem key={book._id}>
                <ListItemText primary={book.volumeInfo.title} />
              </ListItem>
            ))}
        </List>
      </div>
    );
  }
}

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
    )(Home)
  )
);
