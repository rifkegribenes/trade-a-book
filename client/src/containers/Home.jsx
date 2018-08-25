import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Divider from "@material-ui/core/Divider";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiBookActions from "../store/actions/apiBookActions";

import Search from "./Search";
import SearchResults from "./SearchResults";
import AllBooks from "./AllBooks";

import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 400
  }
};

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      books: [],
      currentBook: {},
      title: "",
      author: ""
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="Home">
        <Search />
        {this.props.book.searchResults.length ? <SearchResults /> : null}
        <Divider />
        <AllBooks />
      </div>
    );
  }
}

Home.propTypes = {};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  book: state.book
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  apiBook: bindActionCreators(apiBookActions, dispatch),
  apiProfile: bindActionCreators(apiProfileActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Home)
  )
);
