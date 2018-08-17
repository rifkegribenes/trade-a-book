import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { BASE_URL } from "../store/actions/apiConfig.js";

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    color: "white",
    textDecoration: "none"
  },
  loginButton: {
    textDecoration: "none"
  }
};

class NavBar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              <Link to="/" className={classes.title}>
                Trade a Book
              </Link>
            </Typography>
            {this.props.appState.loggedIn ? (
              <Link to="/logout" className={classes.loginButton}>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.loginButton}
                >
                  Logout
                </Button>
              </Link>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                href={`${BASE_URL}/api/auth/google`}
                className={classes.loginButton}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  appState: state.appState
});

export default withRouter(withStyles(styles)(connect(mapStateToProps)(NavBar)));
