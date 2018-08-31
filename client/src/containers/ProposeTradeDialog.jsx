import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiBookActions from "../store/actions/apiBookActions";

import { withStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

import { openSnackbar } from "./Notifier";

const styles = theme => ({
  root: {
    margin: 0
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
    this.props.handleTradeDialogClose(this.props.bookRequested, bookOffered);
  };

  render() {
    const { classes } = this.props;
    const books = this.props.book.loggedInUserBooks;
    console.log(books);
    const fullWidthDialog = isWidthUp("sm", this.props.width) ? false : true;
    console.log(`fullWidthDialog: ${fullWidthDialog}`);

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={this.props.open}
        style={{ maxWidth: 500, margin: "auto" }}
        fullWidth={fullWidthDialog}
        PaperProps={{ classes }}
      >
        <DialogTitle id="simple-dialog-title">Choose Book to Offer</DialogTitle>
        <Typography variant="subheading" style={{ padding: "0 24px" }}>
          Which of your books would you like to offer in exchange for
          <span style={{ fontWeight: "bold" }}>
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
  selectedValue: PropTypes.string,
  cancel: PropTypes.func,
  book: PropTypes.shape({
    loggedInUserBooks: PropTypes.array
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string
    })
  }),
  apiBook: PropTypes.shape({
    getUserBooks: PropTypes.func
  }),
  bookRequested: PropTypes.object,
  proposeTrade: PropTypes.func,
  handleTradeDialogOpen: PropTypes.func,
  handleTradeDialogClose: PropTypes.func,
  open: PropTypes.bool,
  loggedInUserBooks: PropTypes.array
};

const mapStateToProps = state => ({
  profile: state.profile,
  book: state.book
});

const mapDispatchToProps = dispatch => ({
  apiBook: bindActionCreators(apiBookActions, dispatch)
});

export default withWidth()(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ProposeTradeDialog)
  )
);
