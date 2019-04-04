import React, { Component } from "react";
import axios from "axios";
import { apiBaseUrl } from '../services/api';
export default class Books extends Component {
  state = {
    user: "",
    order: [],
    stock: []
  };

  componentDidMount() {
    this.getStock();
    this.getOrder();
    console.log("你好 in did mount");
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.data !== this.props.data) {
      this.getStock();
      this.getOrder();
      console.log("你好 in did update", prevState);
    }
  }

  getOrder = () => {
    const payload = {
      userId: localStorage.getItem("userId")
    };
    axios
      .post(apiBaseUrl + "/viewOrder", payload)
      .then(response => {
        console.log("Client side: get order by calling /vieworder: ", response.data.books);
        if (response.status === 200) {
          this.setState({
            order: response.data.books
          });
        }
      })
      .catch(err => {
        alert(err.message);
      });
  };


  // view books in order, plus return
  displayOrder = () => {
    const books = this.state.order;
    if(books) {
      const bookItems = books.sort().map(book => (
        <li className="collection-item" key={book._id} style={style.list}>
          {book.bookDetail.title}{" "}
          <button onClick={() => this.returnOrder(book._id)}>Return</button>
        </li>
      ));
      return (
        <div>
          {bookItems.length > 0 ? "" : "You have not ordered any."}
          <ul className="collection">{bookItems}</ul>
        </div>
      )
    } else {
      return (
        <div>Hello Order</div>
      )
    }
    
  };

  getStock = () => {
    axios
      .get(apiBaseUrl + "/book/inStock")
      .then(response => {
        if (response.status === 200) {
          this.setState({
            stock: response.data.books
          });
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  orderOrReturnBook = (bookId, path) => {
    const payload = {
      session: localStorage.getItem("userId"),
      bookId
    };
    axios
      .post(apiBaseUrl + path, payload)
      .then((response) => {
        if(response.status === 200) {
          this.getOrder();
          this.getStock();
          console.log({ response });
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  orderBook = bookId => {
    console.log("This is order book: ", this.state.stock);
    return this.orderOrReturnBook(bookId, "/order");
  };

  returnOrder = bookId => {
    return this.orderOrReturnBook(bookId, "/return");
  };

  // order books
  displayStock = () => {
    const books = this.state.stock;
    console.log("diplay books function: ", books);
    if(books) {
      const bookItems = books.sort().map(book => (
        <li className="collection-item" key={book.bookId} style={style.list}>
          {book.title}
          <button onClick={() => this.orderBook(book.bookId)}>Order</button>
        </li>
      ));
      return (
        <div>
          {bookItems.length > 0 ? "" : "We have no more books in stock"}
          <ul className="collection">{bookItems}</ul>
        </div>
      );
    } else {
      return (
        <div>Hello</div>
      )
    }
  };

  render() {
    return (
      <div style={style}>
        <table>
          <thead>
          <tr>
            <th>Your Order</th>
            <th>Our Stock</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              {this.displayOrder()}
            </td>
            <td>
              {this.displayStock()}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

const style = {
  align: {
    textAlign: 'center',
  },
  list: {
    listStyleType: 'none'
  }
}