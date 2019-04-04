#!/usr/bin/env node

const mongoose = require("mongoose");
const program = require("commander");
const config = require("./config/database");
const User = require("./models/user");
const fs = require('fs');
let rawdata = fs.readFileSync('user.json');
let userId = JSON.parse(rawdata);


mongoose.Promise = global.Promise;

const db = mongoose.connection;
mongoose.connect(
  config.database,
  {
    useNewUrlParser: true,
    useFindAndModify: false
  }
);

const {
  orderBook,
  returnBook,
  viewOrder,
  listStock
} = require("./backend/book");

const { authenticateUser, createUser } = require("./backend/user");

program.version("1.0.0").description("Azamon Bookstore CLI");

program
  .command("create <username> <password>")
  .description("Create a new user")
  .action((username, password) => {
    console.log(username, password);
    createUser(username, password)
      .then((user) => {
        User.create(user, (err, user) => {
          if(err) {
            console.log(err)
          }
          db.close();
        })
      })
      .catch(err => {
        console.log(err);
      })
    }
  )

program
  .command("signIn <username> <password>")
  .description("Sign into account")
  .action((username, password) => {
    authenticateUser(
      username,
      password,
      (err, res) => {
        if (err) {
          console.log(err);
          db.close();
          return;
        }
        if(!res) {
          console.log("username or password is incorrect!");
          db.close();
          return;
        }
        let user = {
          'userId': res._id
        };
        let data = JSON.stringify(user)
        fs.writeFileSync('user.json', data)
        userId = res._id;
        console.log("You have logged in");
        db.close();
      }
    );
  });

program
  .command("signOut")
  .description("Sign out of current session")
  .action(() => {
    let user = {
      'userId': ''
    };
    let data = JSON.stringify(user)
    fs.writeFileSync('user.json', data);
    console.log("You have logged out");
    db.close();
  });

program
  .command("order <bookId>")
  .description("order a book from stock")
  .action(bookId => 
    orderBook(userId.userId, bookId)
    .then(() => {
      console.log("Book was successfully ordered!");
      db.close()
    })
    .catch(err => {
      console.log("This book is not available!");
      db.close()
    }
  ))
      

program
  .command("return <bookId>")
  .description("Return a book to stock")
  .action(bookId => 
    returnBook(userId.userId, bookId)
    .then(() => {
      console.log("Book was successfully returned!");
      db.close()
    })
    .catch(err => {
      console.log("This book is not available for return!");
      db.close()
    }
  ))

program
  .command("viewOrder")
  .description("View user's orders")
  .action(() => {
    if (!userId) {
      console.log("PLease sign in to view");
      return;
    }
    viewOrder(userId.userId)
      .then(books => {
        if(books.length === 0) {
          console.log("You have not ordered any book");
          db.close()
          return;
        }
        books.map(book => console.log(book.bookDetail.title));
        db.close()
      })
      .catch(err => {
        console.log(err);
      });
  });

program
  .command("listStock")
  .description("List books in stock")
  .action(() => {
    listStock()
    .then(books => {
      const uniqBook = groupBy(books, 'title');
      console.log(uniqBook);
      db.close();
    })
    .catch(err => {
      console.log(err);
      db.close();
    });
  });

  function groupBy(objectArray, property) {
    return objectArray.reduce(function (acc, obj) {
      var key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  // Assert that a VALID command is provided 
// if (!process.argv.slice(2).length || !/[arudl]/.test(process.argv.slice(2))) {
//   program.outputHelp();
//   process.exit();
// }
  
  
program.parse(process.argv);