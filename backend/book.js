const express = require("express");
const app = express();
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;
const Book = require("../models/book");
const InStock = require("../models/inStock");
const Order = require("../models/order");
const PhysicalBook = require("../models/physicalBook");
const User = require("../models/user");

const addPhysicalBook = isbn => {
  PhysicalBook.create({ isbn: isbn }, (err, book) => {
    if (err) return handleError(err);
    console.log(book);
    return book;
  });
};

const addOrder = bookId => {
  Order.create({ bookId: bookId }, (err, book) => {
    if (err) return handleError(err);
    console.log(book);
    return book;
  });
};

const addStock = bookId => {
  InStock.create({ bookId: bookId }, (err, book) => {
    if (err) return handleError(err);
    console.log(book);
    return book;
  });
};

const viewBook = bookId => {
  if (!bookId) {
    Promise.reject("Invalid Book ID");
    return;
  }
  return PhysicalBook.findById(bookId).then(book => {
    console.log("book: " + book);
    return Book.findOne({ isbn: book.isbn });
  });
};

const viewOrder = userId => {
  return new Promise(function(resolve, reject) {
    User.findById(userId, (err, user) => {
      if (err) {
        console.log("IS IT HERE?");
        console.log(err);
      }
      if (!user) {
        console.log("Unable to find user");
      }
      const bookIds = user.bookId;
      // console.log("BOOKS?? ", bookIds);
      PhysicalBook.aggregate(
        [
          {
            $lookup: {
              from: "books",
              localField: "isbn",
              foreignField: "isbn",
              as: "bookDetail"
            }
          },
          {
            $unwind: {
              path: "$bookDetail",
              preserveNullAndEmptyArrays: true
            }
          }
        ],
        (err, books) => {
          if (err) {
            reject(err);
            console.log("ERROR in function call");
          }
          if (!books) {
            console.log("THere are no books to display");
          }
          resolve(books.filter(b => bookIds.includes(b._id.toString())));
        }
      );
    });
  });
};


const listBooks = collection => {
  return collection
    .find({})
    .then(books => {
      let bookIds = books.map(book => ObjectId(book.bookId));
      return bookIds;
    })
    .then(bookIds => {
      return PhysicalBook.aggregate([
        {
          $match: {
            _id: { $in: bookIds }
          }
        },
        {
          $group: {
            _id: "$isbn",
            total: { $sum: 1 },
            bookId: { $push: "$_id"}
          }
        },
        {
            $unwind: {
                path: "$bookId",
                preserveNullAndEmptyArrays: true
              }
        }
      ]);
    })
    .then(phyBooks => {
        return new Promise(function(resolve, reject) {
          if (!phyBooks) {
            reject('No more books instock');
            return;
          }
        let result = [];
        for (let book of phyBooks) {
          Book.findOne({ isbn: book._id }, (err, phyBook) => {
            if (err) {
              reject(err);
            }
            const oneBook = {
              title: phyBook.title,
              total: book.total,
              isbn: phyBook.isbn,
              bookId: book.bookId
            };
            result.push(oneBook);

            if (result.length === phyBooks.length) {
              resolve(result);
            }
          });
        }
      });
    });
};

const listToBeShipped = () => {
  return listBooks(Order);
};

const listStock = () => {
  return listBooks(InStock);
};

const orderOrReturn = (session, from, to, action, bookId) => {
  if (!session) {
    Promise.reject("Please login before making");
    return;
  }
  return from.findOne({ bookId }, (err, result) => {
    if (err) {
      Promise.reject(err);
      return;
    }
    if (!result) {
      Promise.reject("this book is no longer available");
      console.log("unable to");
      return;
    }
  })
    .then(book => {
      return new Promise(function(resolve, reject) {
        to.create({ bookId: book.bookId }, (err, book) => {
          if (err) {
            reject(err);
            return;
          }
          if (book) {
            User.findOneAndUpdate(
              { _id: session},
              { [action]: { bookId: book.bookId } },
              (err, user) => {
                if (err) {
                  Promise.reject(err);
                  return;
                }
                if (!user) {
                  Promise.reject("Unable to find user");
                }
                // console.log("finished saving user");
              }
            );
          }
          resolve(bookId);
        });
      });
    })
    .then(bookId => {
      return new Promise((resolve, reject) => {
        from.deleteOne({ bookId: bookId }, function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
};

const orderBook = (session, bookId) => {
  return orderOrReturn(session, InStock, Order, "$push", bookId);
};

const returnBook = (session, bookId) => {
  return orderOrReturn(session, Order, InStock, "$pull", bookId);
};

(module.exports = {
  viewBook,
  listStock,
  listToBeShipped,
  orderBook,
  returnBook,
  addPhysicalBook,
  addOrder,
  addStock,
  viewOrder
}),
  app;
