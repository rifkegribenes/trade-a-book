import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Notifier, { openSnackbar } from "./Notifier";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
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
    textAlign: "center",
    marginTop: 15
  }
});

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      city: "",
      state: ""
    };
  }

  componentWillMount() {
    let userId, token;
    // check route params for user id and token
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
    // retrieve user profile & save to redux store
    this.props.api
      .getProfile(token, userId)
      .then(result => {
        if (result.type === "GET_PROFILE_SUCCESS") {
          console.log("got profile");
          this.props.actions.setLoggedIn();
          if (
            this.props.profile.profile.city ||
            this.props.profile.profile.state
          ) {
            // save city and state to component state
            console.log("saving city and state to component state");
            const newState = { ...this.state };
            newState.city = this.props.profile.profile.city;
            newState.state = this.props.profile.profile.state;
            this.setState({ ...newState }, () => {
              console.log(this.state.city, this.state.state);
              this.closeEdit();
            });
          }
          // check for redirect url in local storage
          const redirect = window.localStorage.getItem("redirect");
          if (redirect) {
            // redirect to originally requested page and then
            // clear value from local storage
            this.props.history.push(redirect);
            window.localStorage.removeItem("redirect");
          }
        } else {
          console.log("not logged in");
          openSnackbar("error", "Please log in to view your profile");
        }
      })
      .catch(err => {
        openSnackbar("error", err);
      });
  }

  componentDidMount() {
    if (!this.props.profile.profile.city || !this.props.profile.profile.state) {
      this.handleEdit();
    } else {
      this.closeEdit();
    }
  }

  handleEdit = () => {
    const newState = { ...this.state };
    newState.edit = true;
    this.setState({ ...newState });
  };

  closeEdit = () => {
    const newState = { ...this.state };
    newState.edit = false;
    this.setState({ ...newState });
  };

  handleInput = ({ target: { name, value } }) => {
    const newState = { ...this.state };
    newState[name] = value;
    this.setState({ ...newState });
  };

  handleSubmit = () => {
    const userId = this.props.profile.profile._id;
    const token = this.props.appState.authToken;
    const body = {
      _id: userId,
      city: this.state.city,
      state: this.state.state,
      firstName: this.props.profile.profile.firstName,
      lastName: this.props.profile.profile.lastName,
      avatarUrl: this.props.profile.profile.avatarUrl
    };
    this.props.api
      .modifyProfile(token, userId, body)
      .then(result => {
        this.closeEdit();
        if (result.type === "MODIFY_PROFILE_SUCCESS") {
          openSnackbar("success", `Profile Saved.`);
        } else if (result.type === "MODIFY_PROFILE_FAILURE") {
          openSnackbar("error", this.props.profile.error);
        }
      })
      .catch(err => openSnackbar("error", err));
  };

  render() {
    const { classes } = this.props;
    const { loggedIn } = this.props.appState;
    const redirect = window.localStorage.getItem("redirect");
    const {
      firstName,
      lastName,
      avatarUrl,
      city,
      state
    } = this.props.profile.profile;
    return (
      <div className={classes.container}>
        {loggedIn &&
          !redirect && (
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={BooksImage}
                title="Books"
              >
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
                {(!city && !state) || this.state.edit ? (
                  <div className={classes.form}>
                    <TextField
                      id="city"
                      label="City"
                      name="city"
                      onChange={this.handleInput}
                      value={this.state.city}
                      fullWidth
                    />
                    <TextField
                      id="state"
                      label="State"
                      name="state"
                      onChange={this.handleInput}
                      value={this.state.state}
                      fullWidth
                    />
                  </div>
                ) : (
                  <Typography component="p" align="center">
                    {city} {state}
                  </Typography>
                )}
              </CardContent>
              <CardActions className={classes.actions} disableActionSpacing>
                <IconButton
                  aria-label={!this.state.edit ? "Edit" : "Save"}
                  title={!this.state.edit ? "Edit" : "Save"}
                  className={classes.icon}
                  color="primary"
                  onClick={
                    !this.state.edit ? this.handleEdit : this.handleSubmit
                  }
                >
                  {!this.state.edit ? <EditIcon /> : <SaveIcon />}
                </IconButton>
              </CardActions>
            </Card>
          )}
        <Notifier />
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
