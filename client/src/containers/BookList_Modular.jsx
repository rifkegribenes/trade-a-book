import React from "react";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
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
  rightIcon: {},
  author: {}
});

const BookList = props => (
  <div className="bookList">
    <Paper>
      <Typography variant="display1" align="center" gutterBottom>
        {props.title}
      </Typography>
      <Typography variant="subheading" align="center" gutterBottom>
        {props.subhead}
      </Typography>
      <List style={{ maxWidth: 600, margin: "auto" }}>
        {props.books.map((book, i, books) => (
          <div key={book._id}>
            <ListItem style={{ paddingRight: 0 }}>
              <img
                className={classes.thumbnail}
                style={{ height: "80px", padding: 10 }}
                src={book.thumbnail}
                alt={book.title}
              />
              <ListItemText
                primary={book.title}
                secondary={`${book.authors.join(", ")}
                (${book.published.substring(0, 4)})`}
              />
              {props.listType === "all" && (
                <IconButton
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  title="Propose a Trade"
                  onClick={() => props.proposeTrade(book)}
                >
                  <SwapHoriz className={classes.rightIcon} />
                </IconButton>
              )}
              {props.listType === "search" && <Button />}
              {props.listType === "user" && <Button />}
            </ListItem>
            {i < books.length - 1 ? <Divider light /> : null}
          </div>
        ))}
      </List>
    </Paper>
  </div>
);

BookList.propTypes = {
  listType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subhead: PropTypes.string,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      authors: PropTypes.arrayOf(PropTypes.String),
      published: PropTypes.string,
      thumbnail: PropTypes.string,
      owner: PropTypes.string
    })
  ).isRequired,
  getPartialProfile: PropTypes.func,
  addBook: PropTypes.func,
  proposeTrade: PropTypes.func,
  removeBook: PropTypes.func
};

export default withStyles(styles)(BookList);
