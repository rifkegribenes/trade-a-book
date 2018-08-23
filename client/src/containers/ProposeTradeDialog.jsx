import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import { withStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { openSnackbar } from "./Notifier";

const styles = theme => ({
  dialog: {
    maxWidth: 500,
    margin: "auto"
  },
  subhead: {
    padding: "0 24px"
  },
  subheadBold: {
    fontWeight: "bold"
  }
});

class ProposeTradeDialog extends React.Component {
  componentDidMount() {
    const userId = this.props.profile.profile._id;
    console.log(userId);

    this.props.apiBook
      .getUserBooks(userId)
      .then(result => {
        console.log(result.type);
        if (result.type === "GET_USER_BOOKS_FAILURE") {
          console.log(this.props.book.error);
          openSnackbar("error", this.props.book.error);
        }
      })
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  }

  handleClose = () => {
    this.props.cancel();
  };

  handleListItemClick = bookOffered => {
    this.props.handleClose(this.props.bookRequested, bookOffered);
  };

  render() {
    const { classes } = this.props;
    const books = this.props.book.loggedInUserBooks;
    console.log(books);

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={this.props.open}
        className={classes.dialog}
      >
        <DialogTitle id="simple-dialog-title">Choose Book to Offer</DialogTitle>
        <Typography variant="subheading" className={classes.subhead}>
          Which of your books would you like to offer in exchange for
          <span className={classes.subheadBold}>
            &nbsp;
            {this.props.bookRequested.title}
          </span>
          ?
        </Typography>
        <div>
          <List>
            {books &&
              books.map(book => (
                <ListItem
                  button
                  onClick={() => this.handleListItemClick(book)}
                  key={book._id}
                >
                  <img
                    className={this.props.classes.thumbnail}
                    style={{ height: "60px", padding: 10 }}
                    src={book.thumbnail}
                    alt={book.title}
                  />
                  <ListItemText primary={book.title} />
                </ListItem>
              ))}
          </List>
        </div>
      </Dialog>
    );
  }
}

ProposeTradeDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string
};

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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProposeTradeDialog)
);
