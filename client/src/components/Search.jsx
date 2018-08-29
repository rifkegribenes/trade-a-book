import React from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import ButtonWithSpinner from "./ButtonWithSpinner";

const Search = props => (
  <div style={{ padding: 20 }}>
    <Typography
      variant="headline"
      align="center"
      gutterBottom
      style={{ paddingTop: 20 }}
    >
      Enter title and author to add a book to your library
    </Typography>
    <form
      className={props.classes.form}
      onError={errors => console.log(errors)}
    >
      <TextField
        name="title"
        label="Title"
        value={props.title}
        onChange={props.handleInput}
        className={props.classes.input}
      />
      <TextField
        name="author"
        label="Author"
        value={props.author}
        onChange={props.handleInput}
        className={props.classes.input}
      />
      <ButtonWithSpinner
        type="button"
        color="primary"
        className={props.classes.button}
        variant="raised"
        onClick={props.searchBook}
        loading={props.book.loading}
      >
        Search book
      </ButtonWithSpinner>
    </form>
  </div>
);

Search.propTypes = {
  book: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string
  }),
  title: PropTypes.string,
  author: PropTypes.string,
  handleInput: PropTypes.func,
  serachBook: PropTypes.func,
  classes: PropTypes.object
};

export default Search;
