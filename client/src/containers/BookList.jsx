import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
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

class BookList extends Component {
  componentDidMount() {
    this.props.apiBook.getAllBooks().then(result => {
      console.log(this.props.book.books);
    });
  }

  proposeTrade = bookData => {
    console.log("proposeTrade");
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="bookList">
        <Paper>
          <Typography variant="display1" align="center" gutterBottom>
            All Books
          </Typography>
          <Typography variant="subheading" align="center" gutterBottom>
            Click 'Trade' to propose a trade
          </Typography>
          <List style={{ maxWidth: 600 }}>
            {this.props.book.books.map((book, i, books) => (
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
                  <Button
                    size="small"
                    variant="contained"
                    color="default"
                    className={classes.button}
                    onClick={() => this.proposeTrade(book)}
                  >
                    Trade
                    <SwapHoriz className={classes.rightIcon} />
                  </Button>
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

BookList.propTypes = {};

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
    )(BookList)
  )
);
