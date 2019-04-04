const express = require("express");
const router = express.Router();
const user = require("../backend/user");
const book = require("../backend/book");
const parser = require("body-parser");
const urlencodedParser = parser.urlencoded({ extended: false });

// User api
router.post("/user/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  user
    .createUser(username, password)
    .then(() => {
        res.status(200).json({
          message: "ok"
        })
    })
    .catch(error => {
        res.status(422).json({
          error: error
        });
  });
})

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  user.authenticateUser(username, password, function(err, user) {
    if (err || !user) {
      var err = new Error("Wrong email or password.");
      res.status(401).json({
        message: err
      });
    } else {
      req.session.userId = user._id;
      res.status(200).json({
        message: "ok",
        token: req.session.userId
      });
    }
  });
});

router.get("/logout", function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        res.status(200).json({
          logout: "ok"
        });
      }
    });
  }
});

// BOOK API
router.post("/viewOrder", (req, res) => {
  console.log(req.body.userId);
  const userId = req.body.userId;
  console.log("API: CLAIRE calling view order api, req: ", req.body, "response: ", res.params);
  book
    .viewOrder(userId)
    .then(books => res.send({ books }))
    .catch(err => console.log("FAIL"));
});

router.post("/physical/:isbn", (req, res, next) => {
  const isbn = req.params.isbn;
  book.addPhysicalBook(isbn);
});

router.post("/addOrder/:bookId", (req, res, next) => {
  const bookId = req.params.bookId;
  book.addOrder(bookId);
});

router.post("/addStock/:bookId", (req, res, next) => {
  const bookId = req.params.bookId;
  book.addStock(bookId);
});

router.post("/book/:id", (req, res, next) => {
  const bookId = req.params.id;
  book
    .viewBook(bookId)
    .then(book => {
      console.log("Success: ", book.title);
    })
    .catch(error => {
      console.log(error);
    });
});

// get books
router.get("/book/inStock", (req, res) => {
  book
    .listStock()
    .then(books => {
      res.status(200).json({ books });
    })
    .catch(error => {
      console.log(error);
    });
});

router.get("/book/toBeShipped", (req, res) => {
  book
    .listToBeShipped()
    .then(books => {
      res.status(200).json({ books });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/order", (req, res, done) => {
  const session = req.body.session;
  const bookId = req.body.bookId;
  console.log("WHICH BOOK ARE MY ORDERING: req.body ", req.body);
  // req is the thing that came in, and res is the finished and sending back to the client.
  book
    .orderBook(session, bookId)
    .then(() => {
      res.status(200).json({ message: "ordered" });
    })
    .catch(error => {
      console.log(error);
    });
});

router.post("/return", (req, res, done) => {
  const session = req.body.session;
  const bookId = req.body.bookId;
  book.returnBook(session, bookId)
    .then(() =>{
      res.status(200).json({ message: "returned" });
    })
    .catch(err => {
      console.log(err);
    })
});


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = router;
