import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
import AddBox from "@material-ui/icons/AddBox";

import { BASE_URL } from "../store/actions/apiConfig.js";

const BookListModular = props => (
  <div className="bookList">
    <Paper>
      <Typography variant="display1" align="center" gutterBottom>
        {props.title}
      </Typography>
      <Typography variant="subheading" align="center" gutterBottom>
        {props.subhead}
      </Typography>
      <List style={{ maxWidth: 600, margin: "auto" }}>
        {props.books.map((bookData, i, books) => {
          let book = { ...bookData };
          let city, state;
          if (props.listType === "search") {
            book = {
              googleId: bookData.id,
              title: bookData.volumeInfo.title,
              authors: [...bookData.volumeInfo.authors],
              published: bookData.volumeInfo.publishedDate,
              thumbnail: bookData.volumeInfo.imageLinks.thumbnail
            };
          } else if (props.listType === "all" && book.ownerData) {
            city = book.ownerData.city;
            state = book.ownerData.state;
          }
          return (
            <div key={book.googleId}>
              <ListItem style={{ paddingRight: 0 }}>
                <img
                  className={props.classes.thumbnail}
                  style={{ height: "80px", padding: 10 }}
                  src={book.thumbnail}
                  alt={book.title}
                />
                <ListItemText
                  primary={book.title}
                  secondary={`${book.authors.join(", ")}
                  (${book.published.substring(0, 4)})`}
                />
                {props.listType === "all" &&
                  book.ownerData && (
                    <div className={props.classes.owner}>
                      <Avatar
                        alt={book.ownerData.firstName}
                        src={book.ownerData.avatarUrl}
                        className={props.classes.avatar}
                      />
                      <ListItemText
                        primary={`Offered by: ${book.ownerData.firstName}`}
                        secondary={
                          city && state
                            ? `${city} ${state}`
                            : city
                              ? city
                              : null
                        }
                      />
                    </div>
                  )}
                {props.listType === "all" && (
                  <IconButton
                    variant="contained"
                    color="primary"
                    className={props.classes.button}
                    title="Propose a Trade"
                    onClick={() => props.proposeTrade(book)}
                  >
                    <SwapHoriz className={props.classes.rightIcon} />
                  </IconButton>
                )}
                {props.listType === "search" ? (
                  props.loggedIn ? (
                    <IconButton
                      size="small"
                      variant="contained"
                      color="default"
                      title="Add Book"
                      className={props.classes.button}
                      onClick={() => props.addBook(book)}
                    >
                      <AddBox />
                    </IconButton>
                  ) : (
                    <a href={`${BASE_URL}/api/auth/google`}>
                      <IconButton
                        size="small"
                        variant="contained"
                        color="default"
                        title="Add Book"
                        className={props.classes.button}
                      >
                        <AddBox />
                      </IconButton>
                    </a>
                  )
                ) : null}
                {props.listType === "user" && <Button />}
              </ListItem>
              {i < books.length - 1 ? <Divider light /> : null}
            </div>
          );
        })}
      </List>
    </Paper>
  </div>
);

BookListModular.propTypes = {
  listType: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool,
  title: PropTypes.string.isRequired,
  subhead: PropTypes.string,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      googleId: PropTypes.string,
      title: PropTypes.string,
      authors: PropTypes.arrayOf(PropTypes.string),
      published: PropTypes.string,
      thumbnail: PropTypes.string,
      owner: PropTypes.string,
      ownerData: PropTypes.shape({
        firstName: PropTypes.string,
        avatarUrl: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string
      })
    })
  ).isRequired,
  classes: PropTypes.object,
  getPartialProfile: PropTypes.func,
  addBook: PropTypes.func,
  proposeTrade: PropTypes.func,
  removeBook: PropTypes.func
};

export default BookListModular;
