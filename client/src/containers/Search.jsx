import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

// import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 400
  },
  form: {
    margin: "auto",
    width: "100%",
    maxWidth: 508,
    height: 92,
    padding: 10
  },
  button: {
    flex: "0 0 auto"
  },
  input: {
    marginRight: 10
  }
});

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
    const { classes } = this.props;
    return (
      <div className="search">
        <Paper>
          <ValidatorForm
            className={classes.form}
            ref="form"
            onSubmit={this.searchBook}
            onError={errors => console.log(errors)}
          >
            <TextValidator
              name="title"
              label="Title"
              value={title}
              onChange={this.handleInput}
              className={classes.input}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextValidator
              name="author"
              label="Author"
              value={author}
              onChange={this.handleInput}
              className={classes.input}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <Button
              type="button"
              className={classes.button}
              color="secondary"
              variant="raised"
              onClick={() => this.searchBook()}
            >
              Search book
            </Button>
          </ValidatorForm>
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
