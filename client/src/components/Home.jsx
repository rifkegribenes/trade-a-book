import React from "react";
import PropTypes from "prop-types";

import book from "../img/book_trade.svg";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
import AddBox from "@material-ui/icons/AddBox";
import List from "@material-ui/icons/List";

const Home = props => (
  <div className={props.classes.container}>
    <div className={props.classes.row}>
      <img src={book} alt="" className={props.classes.hero} />
      <Typography
        variant="display1"
        align="left"
        gutterBottom
        style={{ paddingTop: 20 }}
      >
        Trade books with friends
      </Typography>
    </div>
    <div className={props.classes.row}>
      <div className={props.classes.tinycard}>
        <Typography variant="subheading" className={props.classes.subhead}>
          Add books to your library
        </Typography>
        <IconButton
          variant="contained"
          color="primary"
          className={props.classes.button}
          title="Add a book"
          href={"/new"}
        >
          <AddBox className={props.classes.add} />
        </IconButton>
      </div>
      <div className={props.classes.tinycard}>
        <Typography variant="subheading" className={props.classes.subhead}>
          View books offered for trade
        </Typography>
        <IconButton
          variant="contained"
          color="primary"
          className={props.classes.button}
          title="All books"
          href={"/all"}
        >
          <List className={props.classes.list} />
        </IconButton>
      </div>
      <div className={props.classes.tinycard}>
        <Typography variant="subheading" className={props.classes.subhead}>
          Propose trades
        </Typography>
        <IconButton
          variant="contained"
          color="primary"
          className={props.classes.button}
          title="Propose Trade"
          href={"/all"}
        >
          <SwapHoriz className={props.classes.trade} />
        </IconButton>
      </div>
    </div>
  </div>
);

Home.propTypes = {
  classes: PropTypes.object
};

export default Home;
