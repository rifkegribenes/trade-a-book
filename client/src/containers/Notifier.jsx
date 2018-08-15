import React from "react";
// import PropTypes from 'prop-types';

import CustomSnackbarContentWrapper from "./CustomSnackbarContent";

import Snackbar from "@material-ui/core/Snackbar";

let openSnackbarFn;

class Notifier extends React.Component {
  state = {
    open: false,
    message: "",
    variant: "info"
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  openSnackbar = (variant, message) => {
    this.setState({
      open: true,
      variant,
      message
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: "",
      variant: "info"
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
        autoHideDuration={3000}
        onClose={this.handleSnackbarClose}
      >
        <CustomSnackbarContentWrapper
          variant={this.state.variant}
          message={message}
          open={this.state.open}
        />
      </Snackbar>
    );
  }
}

export const openSnackbar = (variant, message) => {
  openSnackbarFn(variant, message);
};

export default Notifier;
