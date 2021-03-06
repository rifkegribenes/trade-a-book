import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
import AccessTime from "@material-ui/icons/AccessTime";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import ErrorOutline from "@material-ui/icons/ErrorOutline";

import { tradeInfo } from "../utils";

const TradeList = props => (
  <div className={props.classes.container}>
    <Typography
      variant="display1"
      align="center"
      gutterBottom
      className={props.classes.headline}
    >
      {props.title}
    </Typography>
    <Typography variant="subheading" align="center" gutterBottom>
      {props.subhead}
    </Typography>
    <List style={{ width: 600, maxWidth: "100%", margin: "auto" }}>
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
            <ListItem className={props.classes.tradeSummary}>
              <ListItemText
                primary={message}
                style={{
                  textAlign: "center",
                  paddingRight: 0,
                  paddingLeft: 0
                }}
              />
            </ListItem>
            <ListItem
              style={{ paddingRight: 0, paddingLeft: 0 }}
              className={props.classes.tradeRow}
            >
              <div className={props.classes.tradeInfoWrap}>
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
                  <ListItemText
                    style={{ padding: 0 }}
                    primary={bookRequested.title}
                  />
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
                    src={bookOffered.thumbnail}
                    alt={bookOffered.title}
                  />
                  <ListItemText
                    style={{ padding: 0 }}
                    primary={bookOffered.title}
                  />
                </div>
              </div>
              <div className={props.classes.tradeStatusWrap}>
                {props.loggedIn &&
                  props.userId === toUser._id &&
                  status === "pending" && (
                    <div className={props.classes.tinycardFlex}>
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
                    <div className={props.classes.tinycardFlex}>
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
              </div>
            </ListItem>
            {i < trades.length - 1 ? <Divider light /> : null}
          </div>
        );
      })}
    </List>
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
