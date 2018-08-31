import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import SwapHoriz from "@material-ui/icons/SwapHoriz";
import AddBox from "@material-ui/icons/AddBox";
import Delete from "@material-ui/icons/Delete";

import { BASE_URL } from "../store/actions/apiConfig.js";

import AlertDialog from "./AlertDialog";
import ProposeTradeDialog from "../containers/ProposeTradeDialog";

const BookList = props => (
  <div className="bookList">
    {props.listType === "all" &&
      props.tradeDialogOpen && (
        <ProposeTradeDialog
          bookRequested={props.bookRequested}
          proposeTrade={props.proposeTrade}
          handleTradeDialogOpen={props.handleTradeDialogOpen}
          handleTradeDialogClose={props.handleTradeDialogClose}
          open={props.tradeDialogOpen}
          loggedInUserBooks={props.loggedInUserBooks}
        />
      )}
    <Typography
      variant="display1"
      align="center"
      gutterBottom
      style={{ paddingTop: 20 }}
    >
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
          <div key={`${book.googleId}-${i}`}>
            {props.listType === "user" && (
              <AlertDialog
                book={book}
                handleClose={props.handleAlertDialogClose}
                open={props.alertDialogOpen}
                content={`Remove ${book.title} from your library?`}
                action={() => {
                  props.removeBook(book);
                  props.handleAlertDialogClose();
                }}
                buttonText="Delete"
              />
            )}
            <ListItem
              className={props.classes.item}
              style={{ paddingRight: 0 }}
            >
              <img
                className={props.classes.thumbnail}
                style={{ height: "80px", padding: 10 }}
                src={book.thumbnail}
                alt={book.title}
              />
              <ListItemText
                primary={book.title}
                className={props.classes.bookInfo}
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
                      className={props.classes.offered}
                      primary={`Offered by: ${book.ownerData.firstName}`}
                      secondary={
                        city && state ? `${city} ${state}` : city ? city : null
                      }
                    />
                  </div>
                )}
              {props.listType === "all" &&
                props.userId !== book.owner && (
                  <IconButton
                    variant="contained"
                    color="primary"
                    className={props.classes.button}
                    title="Propose a Trade"
                    onClick={() => {
                      props.handleTradeDialogOpen(book);
                    }}
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
                  <IconButton
                    size="small"
                    variant="contained"
                    color="default"
                    title="Add Book"
                    className={props.classes.button}
                    onClick={() => props.setRedirect(book)}
                    href={`${BASE_URL}/api/auth/google`}
                  >
                    <AddBox />
                  </IconButton>
                )
              ) : null}
              {props.listType === "user" && (
                <IconButton
                  size="small"
                  variant="contained"
                  color="default"
                  title="Remove Book"
                  className={props.classes.button}
                  onClick={() => props.handleAlertDialogOpen()}
                >
                  <Delete />
                </IconButton>
              )}
            </ListItem>
            {i < books.length - 1 ? <Divider light /> : null}
          </div>
        );
      })}
    </List>
  </div>
);

BookList.propTypes = {
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
  removeBook: PropTypes.func,
  emptyMsg: PropTypes.string
};

export default BookList;
