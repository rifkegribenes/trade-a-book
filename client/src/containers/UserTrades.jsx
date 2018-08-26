import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiTradeActions from "../store/actions/apiTradeActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import TradeList from "./TradeList";
import Notifier, { openSnackbar } from "./Notifier";

import { withStyles } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  buttonApprove: {
    flex: "0 0 auto",
    color: "white",
    backgroundColor: green[600],
    "&:hover": {
      backgroundColor: green[400],
      transition: "500ms ease-in-out"
    }
  },
  buttonReject: {
    flex: "0 0 auto",
    color: "white",
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.light,
      transition: "500ms ease-in-out"
    }
  },
  thumbnail: {
    flex: "0 0 auto",
    alignSelf: "center",
    height: "80px",
    margin: "10px"
  },
  tinycard: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    padding: "15px",
    border: "1px solid #ddd",
    width: "30%",
    margin: "10px",
    textAlign: "center"
  },
  message: {
    margin: "auto",
    width: "50%",
    textAlign: "center",
    height: "50%"
  },
  container: {
    width: "100%",
    height: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  actions: {
    display: "flex"
  },
  subhead: {
    fontWeight: "700",
    textAlign: "center",
    color: theme.palette.primary.main
  },
  approved: {
    color: green[600],
    height: 72,
    margin: "20px auto",
    width: "auto"
  },
  rejected: {
    color: theme.palette.error.dark,
    height: 72,
    margin: "20px auto",
    width: "auto"
  },
  pending: {
    color: amber[700],
    height: 72,
    margin: "20px auto",
    width: "auto"
  },
  capitalize: {
    textTransform: "capitalize"
  }
});

class UserTrades extends Component {
  state = {
    dialogOpen: false
  };

  componentDidMount() {
    if (this.props.profile.profile._id) {
      this.getUserTrades();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profile.profile._id !== this.props.profile.profile._id) {
      this.getUserTrades();
    }
  }

  getUserTrades = () => {
    const userId = this.props.profile.profile._id;
    this.props.apiTrade
      .getUserTrades(userId)
      .then(result => {
        if (result.type === "GET_USER_TRADES_FAILURE") {
          openSnackbar("error", this.props.trade.error);
          return;
        }
      })
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  };

  updateTrade = (tradeData, status) => {
    console.log("updateTrade");
    const token = this.props.appState.authToken;
    const tradeId = tradeData._id;
    const userId = this.props.profile.profile._id;
    const body = {
      tradeId,
      userId,
      status
    };
    this.props.apiTrade
      .updateTrade(token, body)
      .then(result => {
        if (result.type === "UPDATE_TRADE_SUCCESS") {
          openSnackbar("success", `Set trade staus to ${status}.`);
          // if approved, need to change book owner here
          this.props.apiTrade
            .getUserTrades(userId)
            .then(result => console.log(this.props.trade.trades))
            .catch(err => {
              console.log(err);
              openSnackbar("error", err);
            });
        } else {
          openSnackbar("error", this.props.trade.error);
        }
      })
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  };

  handleOpen = trade => {
    if (trade) {
      if (!this.props.appState.loggedIn) {
        openSnackbar("error", "Please log in to approve or reject a trade");
        return;
      }
    }
    this.setState({ dialogOpen: true });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Notifier />
        {this.props.trade.trades ? (
          <TradeList
            loggedIn={this.props.appState.loggedIn}
            userId={this.props.profile.profile._id}
            title={`${this.props.profile.profile.firstName}'s Trades`}
            trades={this.props.trade.trades}
            updateTrade={this.updateTrade}
            handleAlertDialogOpen={this.handleOpen}
            handleAlertDialogClose={this.handleClose}
            alertDialogOpen={this.state.dialogOpen}
            classes={this.props.classes}
          />
        ) : (
          <div className={classes.container}>
            <div className={classes.message}>No trades</div>
          </div>
        )}
      </div>
    );
  }
}
UserTrades.propTypes = {};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  book: state.book,
  trade: state.trade
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  apiTrade: bindActionCreators(apiTradeActions, dispatch),
  apiBook: bindActionCreators(apiBookActions, dispatch),
  apiProfile: bindActionCreators(apiProfileActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UserTrades)
  )
);
