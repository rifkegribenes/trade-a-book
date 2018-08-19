import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";

import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import { withStyles } from "@material-ui/core/styles";

import BooksImage from "../img/RainbowBooks_400.jpg";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  card: {
    margin: "auto",
    width: "100%",
    maxWidth: 300
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    position: "relative"
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end"
  },
  icon: {},
  avatar: {
    width: 80,
    height: 80,
    position: "absolute",
    top: 100,
    left: "calc(50% - 40px)"
  },
  container: {
    height: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  name: {
    color: "primary",
    textAlign: "center"
  }
});

class Profile extends React.Component {
  componentWillMount() {
    let userId, token;
    if (this.props.match && this.props.match.params.id) {
      userId = this.props.match.params.id;
      token = this.props.match.params.token;
      // if logged in for first time through social auth,
      // save userId & token to local storage
      window.localStorage.setItem("userId", JSON.stringify(userId));
      window.localStorage.setItem("authToken", JSON.stringify(token));
      this.props.actions.setLoggedIn();
      this.props.actions.setSpinner("hide");
      // remove id & token from route params after saving to local storage
      window.history.replaceState(
        null,
        null,
        `${window.location.origin}/profile`
      );
    } else {
      // if userId is not in route params
      // look in redux store or local storage
      userId =
        this.props.profile.profile._id ||
        JSON.parse(window.localStorage.getItem("userId"));
      if (window.localStorage.getItem("authToken")) {
        token = JSON.parse(window.localStorage.getItem("authToken"));
      } else {
        token = this.props.appState.authToken;
      }
    }
    // retrieve user profile & save to app state
    this.props.api.getProfile(token, userId).then(result => {
      if (result.type === "GET_PROFILE_SUCCESS") {
        this.props.actions.setLoggedIn();
        // check for redirect url in local storage
        const redirect = window.localStorage.getItem("redirect");
        if (redirect) {
          // redirect to originally requested page and then
          // clear value from local storage
          this.props.history.push(redirect);
          window.localStorage.removeItem("redirect");
        }
      }
    });
  }

  render() {
    const { classes } = this.props;
    const {
      firstName,
      lastName,
      avatarUrl,
      city,
      state
    } = this.props.profile.profile;
    return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardMedia className={classes.media} image={BooksImage} title="Books">
            <Avatar
              alt={`${firstName} ${lastName}`}
              src={avatarUrl}
              className={classes.avatar}
            />
          </CardMedia>
          <CardContent>
            <Typography variant="headline" className={classes.name}>
              {`${firstName} ${lastName}`}
            </Typography>
            <Typography component="p">
              {city} {state}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton
              aria-label="Edit"
              className={classes.icon}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}

Profile.propTypes = {
  appState: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string
    })
  }).isRequired,
  actions: PropTypes.shape({
    setLoggedIn: PropTypes.func,
    dismissModal: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    getProfile: PropTypes.func
  }).isRequired,
  profile: PropTypes.shape({
    user: PropTypes.shape({
      profile: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        avatarUrl: PropTypes.string
      }).isRequired,
      local: PropTypes.shape({
        email: PropTypes.string
      }),
      facebook: PropTypes.shape({
        email: PropTypes.string,
        token: PropTypes.string
      }),
      github: PropTypes.shape({
        email: PropTypes.string,
        token: PropTypes.string
      }),
      google: PropTypes.shape({
        email: PropTypes.string,
        token: PropTypes.string
      })
    }),
    errorMsg: PropTypes.string,
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiProfileActions, dispatch)
});

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Profile)
  )
);
