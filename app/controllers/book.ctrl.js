const Book = require('../models/book');
const User = require('../models/user');
const utils = require('../utils');

// Get all books
exports.getAllBooks = (req, res, next) => {
  Book.find()
  	.then((books) => {
    	return res.status(200).json({books});
  	})
  	.catch((err) => {
  		console.log(`book.ctrl.js > getAllBooks: ${err}`);
  		return handleError(res, err);
  	});
};

// Get all books for one user. params = userId
exports.getUserBooks = (req, res, next) => {
  console.log(`book.ctrl.js > getUserBooks: ${req.params.userId}`);
  Book.find({ owner: req.params.userId })
    .then((books) => {
      return res.status(200).json({books});
    })
    .catch((err) => {
      console.log(`book.ctrl.js > getUserBooks: ${err}`);
      return handleError(res, err);
    });
};

// Get a single book by id. params = bookId
exports.getBookById = (req, res, next) => {
  Book.find({ _id: req.params.bookId })
    .then((book) => {
      return res.status(200).json({book});
      })
    .catch(err => {
      console.log(`book.ctrl.js > getBookById: ${err}`);
      return handleError(res, err);
    });
};

// add new book. params: title, author
exports.searchBook = (req, res, next) => {
	const { title, author } = req.params;

  const url = `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&projection=lite&printType=books&fields=items(id, volumeInfo/title, volumeInfo/authors, volumeInfo/description, volumeInfo/publishedDate, volumeInfo/imageLinks)&maxResults=3&key=${process.env.GOOGLE_API_KEY}`

  utils.getContent(url)
    .then((data) => {
      const books = data.items.filter((book) => book.volumeInfo.imageLinks.thumbnail && book.volumeInfo.imageLinks.thumbnail.length);
      return res.status(200).json({ books });
    })
    .catch((err) => {
      console.log(`book.ctrl.js > searchBook: ${err}`);
      return handleError(res, err);
    });
};

exports.addBook = (req, res, next) => {
  const book = req.body;
  console.log(book);

    const newBook = new Book({
      googleId: book.googleId,
      title: book.title,
  		authors: [ ...book.authors ],
  		owner: book.owner,
  		published: book.published,
  		thumbnail: book.thumbnail
    });
    console.log(newBook);

    // check if exists in db first b4 creating new -- findOrCreate ??

    newBook.save()
	    .then((book) => {
	      console.log('new book saved');
	      console.log(book);
	      return res.status(200).json({
	          message: 'Book saved successfully',
	          book
	        });
	    })
	    .catch((err) => {
	      console.log(`book.ctrl.js > addBook: ${err}`);
      return handleError(res, err);
	    });
}

// change ownership of a book. params = bookId, userId of new owner
exports.updateBookOwner = (req, res, next) => {
  const { bookId, userId } = req.params;

  const target = { _id: bookId };
  const updates = { owner: userId };
  const options = { new: true };

  Book.findOneAndUpdate(target, updates, options)
  	.exec()
    .then((book) => {
    	return res.status(200).json({book});
      })
    .catch((err) => {
      console.log(`book.ctrl.js > updateBookOwner: ${err}`);
      return handleError(res, err);
    });
}

const handleError = (res, err) => {
  return res.status(500).json({message: err});
}

