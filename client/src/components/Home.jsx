import React from "react";
// import PropTypes from "prop-types";

import book from "../img/book_trade.svg";
import Typography from "@material-ui/core/Typography";

const Home = props => (
  <div className={props.classes.container}>
    <div className={props.classes.row}>
      <img src={book} className={props.classes.hero} />
      <Typography
        variant="display1"
        align="left"
        gutterBottom
        style={{ paddingTop: 20 }}
      >
        Here's where some 'About this app' content will go, also maybe the
        AddBook component?
      </Typography>
    </div>
  </div>
);

Home.propTypes = {};

export default Home;
