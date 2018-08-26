import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
import AccessTime from "@material-ui/icons/AccessTime";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import ErrorOutline from "@material-ui/icons/ErrorOutline";

import tradeInfo from "../utils";

const TradeList = props => (
  <div className="tradeList">
    <Paper>
      <Typography variant="display1" align="center" gutterBottom>
        {props.title}
      </Typography>
      <Typography variant="subheading" align="center" gutterBottom>
        {props.subhead}
      </Typography>
      <List style={{ maxWidth: 600, margin: "auto" }}>
        {props.trades.map((trade, i, trades) => {
          const {
            _id,
            toUser,
            fromUser,
            bookRequested,
            bookOffered,
            status,
            createdAt,
            updatedAt
          } = trade;
          let userProposed = true;
          if (props.userId === toUser._id) {
            userProposed = false;
          }
          const message = tradeInfo(
            userProposed,
            toUser,
            fromUser,
            status,
            createdAt,
            updatedAt
          );
          return (
            <div key={_id}>
              <ListItem
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: 24,
                  paddingBottom: 0
                }}
              >
                <ListItemText primary={message} />
              </ListItem>
              <ListItem style={{ paddingRight: 0 }}>
                <div className={props.classes.tinycard}>
                  <Typography
                    variant="subheading"
                    className={props.classes.subhead}
                  >
                    Requested
                  </Typography>
                  <img
                    className={props.classes.thumbnail}
                    src={bookRequested.thumbnail}
                    alt={bookRequested.title}
                  />
                  <ListItemText primary={bookRequested.title} />
                </div>
                <SwapHoriz className={props.classes.icon} />
                <div className={props.classes.tinycard}>
                  <Typography
                    variant="subheading"
                    className={props.classes.subhead}
                  >
                    Offered
                  </Typography>
                  <img
                    className={props.classes.thumbnail}
                    style={{ height: "80px", width: "auto", padding: 10 }}
                    src={bookOffered.thumbnail}
                    alt={bookOffered.title}
                  />
                  <ListItemText primary={bookOffered.title} />
                </div>
                {props.loggedIn &&
                  props.userId === toUser._id &&
                  status === "pending" && (
                    <div className={props.classes.tinycard}>
                      <Typography
                        variant="subheading"
                        className={props.classes.subhead}
                      >
                        Process Trade
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        className={props.classes.buttonApprove}
                        title="Approve Trade"
                        style={{ margin: "20px auto" }}
                        onClick={() => {
                          console.log("Approve Trade");
                          props.updateTrade(trade, "approved");
                        }}
                      >
                        <CheckCircleOutline />
                        &nbsp;Approve
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        className={props.classes.buttonReject}
                        title="Reject Trade"
                        style={{ margin: "10px auto" }}
                        onClick={() => {
                          console.log("Reject Trade");
                          props.updateTrade(trade, "rejected");
                        }}
                      >
                        <ErrorOutline />
                        &nbsp;Reject
                      </Button>
                    </div>
                  )}
                {props.loggedIn &&
                  !(props.userId === toUser._id && status === "pending") && (
                    <div className={props.classes.tinycard}>
                      <Typography
                        variant="subheading"
                        className={props.classes.subhead}
                      >
                        Status
                      </Typography>
                      {status === "pending" ? (
                        <AccessTime className={props.classes.pending} />
                      ) : status === "approved" ? (
                        <CheckCircleOutline
                          className={props.classes.approved}
                        />
                      ) : (
                        <ErrorOutline className={props.classes.rejected} />
                      )}
                      <ListItemText
                        primary={status}
                        className={props.classes.capitalize}
                      />
                    </div>
                  )}
              </ListItem>
              {i < trades.length - 1 ? <Divider light /> : null}
            </div>
          );
        })}
      </List>
    </Paper>
  </div>
);

TradeList.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  subhead: PropTypes.string,
  trades: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      fromUser: PropTypes.shape({
        _id: PropTypes.string,
        firstName: PropTypes.string,
        avatarUrl: PropTypes.string
      }),
      toUser: PropTypes.shape({
        _id: PropTypes.string,
        firstName: PropTypes.string,
        avatarUrl: PropTypes.string
      }),
      bookRequested: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        thumbnail: PropTypes.string
      }),
      bookOffered: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        thumbnail: PropTypes.string
      }),
      status: PropTypes.string,
      createdAt: PropTypes.date
    })
  ).isRequired,
  classes: PropTypes.object,
  viewTrade: PropTypes.func,
  updateTrade: PropTypes.func
};

export default TradeList;
