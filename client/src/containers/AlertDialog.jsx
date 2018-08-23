import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const AlertDialog = props => (
  <div>
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby={
        props.title ? "alert-dialog-title" : "alert-dialog-description"
      }
      aria-describedby="alert-dialog-description"
    >
      {props.title && (
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      )}
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant="outlined" color="default">
          Cancel
        </Button>
        <Button
          onClick={props.action}
          color="secondary"
          variant="contained"
          autoFocus
        >
          {props.buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default AlertDialog;
