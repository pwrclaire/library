# The Library Project

This is 1995. The world is about change.

## Getting Started

The two features completed for this project are:

1. Command Line Interface
2. Web version

### Prerequisites

Please switch into /azamon-server and make sure you have node(https://nodejs.org/en/) installed, then do

```
npm install
```

## Installations

### Server Environment setup

Before executing the CLI or web service, we require the server to be up and running, please do
```
npm start
```
It runs on localhost:3000 by default.

## CLI

To get the CLI running, open up a new terminal window inside /azamon-server without terminating the server and run

```
npm link
```
this will link a 'azamon-cli' command to your command line, where you can run all the available commands.

If this does not work, we can still use the CLI like so:
```
node commands.js -help
```

To see the different commands, do
```
azamon-cli -help
```
If the terminal freezes for any reason, it means that the command you have just entered is not found. Please refer back to -help.

You first will need to create a new user, so
```
azamon-cli create <username> <password>
```
where username and password are required fields.

The same setup would be for logging in, but logging out is simple.

Once you are logged in, you will have the freedom to browse through the in stock section of the bookstore.

You can add books to your order by having it list out the books, and copying the bookId, and paste it when you want to order a certain book:
```
azamon-cli listStock
```
an example bookId would be
```
5c4e5a284754f3a2ce9ef348
```
After ordering it, you can view it like so,
```
azamon-cli viewOrder
```
However, you can only return it if you know the bookId, so that's where the web portal comes to play.

## Web

Welcome to the web.

Please cd into the /client folder, and run
```
npm start
```
By default, your api will be connected to localhost:3000. If you wish to use another port, please go into /client/src/services/ and change it in api.js.

Once it's connected to the server, you can login, register, order, and return books just like the CLI.


If at any time login/register function fails, you can use username: claire and password: 123123 for testing the app.

## Database struture

```
users - A User model consists of username, encrypted password, and an array of bookIds that the person has ordered.
books - A Book model consits of title, author, isbn, width, and height. It does not have information on the numbers that are available or ordered. Each unique book will not repeat twice, and can be looked up by its unique isbn.
physicalBooks - A model containiing the actual bookId string, and isbn number unique to each Book model.
instocks - This collection lists the number and identiy of books that are currently available in stock, model contains only of bookId.
orders - THis collection is a list of books that have been ordered by customers. It does not store customer info, only stores bookId.
sessions - Stores user sessions.

```

## Built With

* [React](https://reactjs.org/) - Frontend Framework
* [Commandjs](https://github.com/tj/commander.js/) - Node.js CLI Tool
* [MongoDB](https://www.mongodb.com/) - Database
* [Node.js](https://nodejs.org/en/) - Server


## Authors

* **Claire Peng** - *Initial work* - [website](https://clairepeng.ca)
