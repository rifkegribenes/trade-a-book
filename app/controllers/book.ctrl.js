import googleBooks from 'google-books-search';

const Book = require('../models/book');
const User = require('../models/user');

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

// add new book. params: title, userId
exports.addBook = (req, res, next) => {

	const title = req.params.title.trim();
	const userId = req.params.userId

	const searchOptions = {
	    key: process.env.GOOGLE_KEY,
	    field: 'title',
	    offset: 0,
	    limit: 10,
	    type: 'books',
	    order: 'newest',
	    lang: 'en'
	};

  googleBooks.search(title, searchOptions, (err, results, apiResponse) => {
    if (err) {
      console.log(`book.ctrl.js > addBook: ${err}`);
      return handleError(res, err);
    }

    let book;
    for (let bookId in results) {
      if (results[bookId].thumbnail && results[bookId].thumbnail.length) {
        book = results[bookId];
        break;
      }
    }

    if (!book) {
      return res.status(400).json({ message: 'Book not found.' });
    }

    const newBook = new Book({
      title: book.title,
  		authors: [ ...book.authors ],
  		owner: userId,
  		published: book.publishedDate,
  		thumbnail: book.thumbnail
    });
    console.log(newBook);

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
    });
	};

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

