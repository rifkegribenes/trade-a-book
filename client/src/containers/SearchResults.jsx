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
import AddBox from "@material-ui/icons/AddBox";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  author: {}
});

class SearchResults extends Component {
  componentDidMount() {}

  render() {
    const { classes } = this.props;
    return (
      <div className="searchResults">
        <Paper>
          <Typography variant="display1" align="center" gutterBottom>
            Search Results
          </Typography>
          <List style={{ maxWidth: 600 }}>
            {this.props.book.searchResults.map((book, i, books) => (
              <div key={book.id}>
                <ListItem style={{ paddingRight: 0 }}>
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
                  <Button
                    size="small"
                    variant="contained"
                    color="default"
                    className={classes.button}
                  >
                    Add
                    <AddBox className={classes.rightIcon} />
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
