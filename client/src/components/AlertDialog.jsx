import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    margin: 0
  }
});

class AlertDialog extends Component {
  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby={
            this.props.title ? "alert-dialog-title" : "alert-dialog-description"
          }
          aria-describedby="alert-dialog-description"
          PaperProps={{ classes: this.props.classes }}
        >
          {this.props.title && (
            <DialogTitle id="alert-dialog-title">
              {this.props.title}
            </DialogTitle>
          )}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.props.handleClose}
              variant="outlined"
              color="default"
            >
              Cancel
            </Button>
            <Button
              onClick={this.props.action}
              color="secondary"
              variant="contained"
              autoFocus
            >
              {this.props.buttonText}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

AlertDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  buttonText: PropTypes.string,
  handleClose: PropTypes.func,
  action: PropTypes.func
};

export default withStyles(styles)(AlertDialog);
