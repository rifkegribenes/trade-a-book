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
  rightIcon: {},
  author: {},
  owner: {
    display: "flex"
  }
});

class UserTrades extends Component {
  state = {
    dialogOpen: false
  };

  componentDidMount() {
    const userId = this.props.profile.profile._id;

    if (!this.props.appState.loggedIn || !userId) {
      openSnackbar("error", "Please log in to view your trades");
      return;
    }

    this.props.apiTrade
      .getUserTrades(userId)
      .then(result => {
        console.log(result.type);
        console.log(this.props.trade.trades);
        if (result.type === "GET_USER_TRADES_FAILURE") {
          openSnackbar("error", this.props.trade.error);
          return;
        }
      })
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  }

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
    console.log(this.props.trade.trades);
    return (
      <div className="tradeList">
        <Notifier />
        {this.props.appState.loggedIn && this.props.trade.trades.length ? (
          <TradeList
            loggedIn={this.props.appState.loggedIn}
            title={`${this.props.profile.profile.firstName}'s Trades`}
            trades={this.props.trade.trades}
            updateTrade={this.updateTrade}
            handleAlertDialogOpen={this.handleOpen}
            handleAlertDialogClose={this.handleClose}
            alertDialogOpen={this.state.dialogOpen}
            classes={this.props.classes}
          />
        ) : (
          "Loading..."
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
