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
            toUserData,
            fromUserData,
            bookRequestedData,
            bookOfferedData,
            status
          } = trade;
          console.log(trade);
          return (
            <div key={_id}>
              <ListItem style={{ paddingRight: 0 }}>
                {bookRequestedData && (
                  <div>
                    <img
                      className={props.classes.thumbnail}
                      style={{ height: "80px", padding: 10 }}
                      src={bookRequestedData.thumbnail}
                      alt={bookRequestedData.title}
                    />
                    <ListItemText primary={bookRequestedData.title} />
                  </div>
                )}
                {toUserData && (
                  <div className={props.classes.owner}>
                    <Avatar
                      alt={toUserData.firstName}
                      src={toUserData.avatarUrl}
                      className={props.classes.avatar}
                    />
                    <ListItemText
                      primary={`Requested from: ${toUserData.firstName}`}
                    />
                  </div>
                )}
                {bookOfferedData && (
                  <div>
                    <img
                      className={props.classes.thumbnail}
                      style={{ height: "80px", padding: 10 }}
                      src={bookOfferedData.thumbnail}
                      alt={bookOfferedData.title}
                    />
                    <ListItemText primary={bookOfferedData.title} />
                  </div>
                )}
                {fromUserData && (
                  <div className={props.classes.owner}>
                    <Avatar
                      alt={fromUserData.firstName}
                      src={fromUserData.avatarUrl}
                      className={props.classes.avatar}
                    />
                    <ListItemText
                      primary={`Offered by: ${fromUserData.firstName}`}
                    />
                  </div>
                )}
                {props.loggedIn &&
                  props.userId === toUser &&
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
                  !(props.userId === toUser && status === "pending") && (
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
      fromUser: PropTypes.string,
      fromUserData: PropTypes.shape({
        firstName: PropTypes.string,
        avatarUrl: PropTypes.string
      }),
      toUser: PropTypes.string,
      toUserData: PropTypes.shape({
        firstName: PropTypes.string,
        avatarUrl: PropTypes.string
      }),
      bookRequested: PropTypes.string,
      bookRequestedData: PropTypes.shape({
        title: PropTypes.string,
        thumbnail: PropTypes.string
      }),
      bookOffered: PropTypes.string,
      bookOfferedData: PropTypes.shape({
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
