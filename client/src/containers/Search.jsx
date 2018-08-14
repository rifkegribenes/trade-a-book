import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 400
  }
};

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      author: ""
    };
  }

  componentDidMount() {}

  handleInput = ({ target: { name, value } }) =>
    this.setState({
      [name]: value
    });

  searchBook = () => {
    console.log("searchBook");
    const title = encodeURIComponent(this.state.title);
    const author = encodeURIComponent(this.state.author);

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
      <div className="search">
        <Paper>
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
      </div>
    );
  }
}

Search.propTypes = {};

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
    )(Search)
  )
);
