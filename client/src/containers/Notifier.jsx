import React from "react";
// import PropTypes from 'prop-types';

import CustomSnackbarContentWrapper from "./CustomSnackbarContent";

import Snackbar from "@material-ui/core/Snackbar";

let openSnackbarFn;

class Notifier extends React.Component {
  state = {
    open: false,
    message: "",
    variant: "info",
    action: null
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  openSnackbar = (variant, message, action) => {
    this.setState({
      open: true,
      variant,
      message,
      action
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: "",
      variant: "info",
      action: null
    });
  };

  render() {
    const message = (
      <span
        id="snackbar-message-id"
        dangerouslySetInnerHTML={{ __html: this.state.message }}
      />
    );

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={this.state.open}
        autoHideDuration={this.state.variant === "error" ? null : 3000}
        onClose={this.handleSnackbarClose}
      >
        <CustomSnackbarContentWrapper
          variant={this.state.variant}
          message={message}
          open={this.state.open}
          action={this.state.action}
        />
      </Snackbar>
    );
  }
}

export const openSnackbar = (variant, message, action) => {
  openSnackbarFn(variant, message, action);
};

export default Notifier;
