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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";

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

function ListItemLink(props) {
  const { primary, to, handleClose } = props;
  return (
    <MenuItem button component={Link} to={to} onClick={handleClose}>
      <ListItemText primary={primary} />
    </MenuItem>
  );
}

ListItemLink.propTypes = {
  primary: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired
};

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              aria-owns={anchorEl ? "nav-menu" : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="nav-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
              component="nav"
            >
              <ListItemLink
                to="/profile"
                primary="Profile"
                handleClose={this.handleClose}
              />
              <ListItemLink
                to="/library"
                primary="My Books"
                handleClose={this.handleClose}
              />
              <ListItemLink
                to="/trades"
                primary="My Trades"
                handleClose={this.handleClose}
              />
            </Menu>
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
              <Button
                variant="contained"
                color="secondary"
                className={classes.loginButton}
                href="/logout"
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                href={`${BASE_URL}/api/auth/google`}
                className={classes.loginButton}
                onClick={() => {
                  window.localStorage.setItem(
                    "redirect",
                    this.props.location.pathname
                  );
                }}
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
