import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
// import update from "immutability-helper";
import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";

class Profile extends React.Component {
  componentWillMount() {
    let userId, token;
    if (this.props.match && this.props.match.params.id) {
      userId = this.props.match.params.id;
      token = this.props.match.params.token;
      console.log(`userId: ${userId}`);
      console.log(`${token ? "token exists" : "no token"}`);
      // if logged in for first time through social auth,
      // need to save userId & token to local storage
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
      console.log(this.props.appState.loggedIn);
    }
    // retrieve user profile & save to app state
    this.props.api.getProfile(token, userId).then(result => {
      if (result.type === "GET_PROFILE_SUCCESS") {
        this.props.actions.setLoggedIn();
        console.log(this.props.appState.loggedIn);
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
    return (
      <div>
        <div>{this.props.profile.profile.firstName}</div>
        <div>{this.props.profile.profile.lastName}</div>
        <div>{this.props.profile.profile.email}</div>
        <div>{this.props.profile.profile.avatarUrl}</div>
        <div>{this.props.profile.profile.city}</div>
        <div>{this.props.profile.profile.state}</div>
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Profile)
);
