import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiTradeActions from "../store/actions/apiTradeActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import TradeList from "../components/TradeList";
import Notifier, { openSnackbar } from "./Notifier";

import { withStyles } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  tradeSummary: {
    padding: "0 20px",
    maxWidth: "100%"
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
    margin: "10px",
    [theme.breakpoints.down("sm")]: {
      width: "40px",
      margin: "3px",
      height: "auto"
    }
  },
  tradeRow: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap"
    }
  },
  tradeInfoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center"
    }
  },
  tradeStatusWrap: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "stretch",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: "0 10px"
    }
  },
  icon: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  tinycard: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    padding: "15px",
    border: "1px solid #ddd",
    width: "45%",
    margin: "10px",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      width: "42%",
      minWidth: 100,
      padding: "5px",
      margin: "5px"
    }
  },
  tinycardFlex: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    padding: "15px",
    border: "1px solid #ddd",
    width: "100%",
    margin: "10px",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      width: "calc(80% + 20px)",
      maxWidth: 300,
      margin: "5px"
    }
  },
  message: {
    margin: "auto",
    width: "50%",
    textAlign: "center",
    height: "50%",
    lineHeight: "2em"
  },
  container: {
    width: "100%",
    maxWidth: 1200,
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
  },
  headline: {
    paddingTop: 20
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
          // if approved, change book owner?
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
        {this.props.trade.trades.length ? (
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
            <Typography className={classes.message}>
              You have not proposed any trades yet.
              <br />
              <Link to="/all">Check out the list of offered books</Link>
              <br />
              and propose a trade to get started.
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

UserTrades.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }),
  trade: PropTypes.shape({
    error: PropTypes.string,
    trades: PropTypes.array
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string,
      firstName: PropTypes.string
    })
  }),
  classes: PropTypes.object,
  apiTrade: PropTypes.shape({
    getUserTrades: PropTypes.func,
    updateTrade: PropTypes.func
  })
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  book: state.book,
  trade: state.trade
});

const mapDispatchToProps = dispatch => ({
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
