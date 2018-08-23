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
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

import { openSnackbar } from "./Notifier";

const styles = {
  avatar: {}
};

class ProposeTradeDialog extends React.Component {
  componentDidMount() {
    const userId = this.props.profile.profile._id;

    this.props.apiBook
      .getUserBooks(userId)
      .then(result => {})
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;
    const books = this.props.book.books;

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
        open={this.props.open}
      >
        <DialogTitle id="simple-dialog-title">Choose Book</DialogTitle>
        <Typography variant="subheading">
          Which book would you like to offer in exchange?
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
            <ListItem
              button
              onClick={() => this.handleListItemClick("addBook")}
            >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="add book" />
            </ListItem>
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
