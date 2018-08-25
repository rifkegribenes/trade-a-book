import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

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
            status
          } = trade;
          console.log(trade);
          return (
            <div key={_id}>
              <ListItem style={{ paddingRight: 0 }}>
                <div className={props.classes.owner}>
                  <img
                    className={props.classes.thumbnail}
                    style={{ height: "80px", padding: 10 }}
                    src={bookRequested.thumbnail}
                    alt={bookRequested.title}
                  />
                  <ListItemText primary={bookRequested.title} />
                </div>
                <div className={props.classes.owner}>
                  <Avatar
                    alt={toUser.firstName}
                    src={toUser.avatarUrl}
                    className={props.classes.avatar}
                  />
                  <ListItemText
                    primary={`Requested from: ${toUser.firstName}`}
                  />
                </div>
                <div className={props.classes.owner}>
                  <img
                    className={props.classes.thumbnail}
                    style={{ height: "80px", padding: 10 }}
                    src={bookOffered.thumbnail}
                    alt={bookOffered.title}
                  />
                  <ListItemText primary={bookOffered.title} />
                </div>
                <div className={props.classes.owner}>
                  <Avatar
                    alt={fromUser.firstName}
                    src={fromUser.avatarUrl}
                    className={props.classes.avatar}
                  />
                  <ListItemText primary={`Offered by: ${fromUser.firstName}`} />
                </div>
                {props.loggedIn &&
                  props.userId === toUser._id &&
                  status === "pending" && (
                    <div className={props.classes.actions}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={props.classes.button}
                        title="Approve Trade"
                        onClick={() => {
                          console.log("Approve Trade");
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className={props.classes.button}
                        title="Reject Trade"
                        onClick={() => {
                          console.log("Reject Trade");
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                {props.loggedIn &&
                  !(props.userId === toUser._id && status === "pending") && (
                    <div className={props.classes.actions}>
                      <ListItemText primary={status} />
                      <Button
                        variant="contained"
                        color="secondary"
                        className={props.classes.button}
                        title="View Trade"
                        onClick={() => {
                          console.log("View Trade");
                        }}
                      >
                        View Trade
                      </Button>
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
