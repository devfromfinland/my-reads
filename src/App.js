import React from 'react'
import BookShelf from './utils/BookShelf'
import './App.css'
import { Route, Link } from 'react-router-dom'
import SearchBook from './utils/SearchBook'
import * as BooksAPI from './BooksAPI'

class BooksApp extends React.Component {
  state = {
    myBooks: [],
    myShelves: ['currentlyReading', 'wantToRead', 'read'],
  }

  componentDidMount() {
    // TODO: Fetch current books from database and assign it to state
    BooksAPI.getAll()
      .then((books) => {
        this.setState(() => ({
          myBooks: books
      }))
    })
  }

  // TODO: update book.shelf with newShelf
  changeShelf = (book, newShelf) => {

    // TODO: Deep clone myBooks array
    // let myUpdatedBooks = [...this.state.myBooks]; // this is a shallow clone
    let myUpdatedBooks = JSON.parse(JSON.stringify(this.state.myBooks));

    // Flag to check if the book is new
    // Flag = 1: The book is new
    // Flag = 0: The book exists in my library
    let flag = 1;

    for (let index = 0; index < this.state.myBooks.length; index++) {
      if (book.id === myUpdatedBooks[index].id) {
        // TODO: Book is already in myBooks
        // Remove the book if 'none' is selected
        // Otherwise, update 'shelf' to the newShelf
        (newShelf !== 'none')
          ? myUpdatedBooks[index].shelf = newShelf
          : myUpdatedBooks.splice(index, 1)
        
        // TODO: Turn the flag to 0, meaning the book is existed
        flag = 0;
        break;
      }
    }

    // TODO: When the book is new, add the new book to myBooks
    if (flag === 1) {
      // TODO: Deep clone the book object
      //let copyBook = {...book};
      let copyBook = JSON.parse(JSON.stringify(book));
      copyBook.shelf = newShelf;
      myUpdatedBooks.push(copyBook);
    }

    BooksAPI.update(book, newShelf)
      .then(this.setState(() => ({
        myBooks: myUpdatedBooks
      })))
  }

  render() {
    return (
      <div className="app">
        <Route path='/search' render={() => (
          <SearchBook
            myBooks={this.state.myBooks} 
            handleChangeShelf={(book, newShelf) => this.changeShelf(book, newShelf)}
          />
        )}/>

        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <BookShelf
                listBooks={this.state.myBooks}
                shelfTitles={this.state.myShelves}
                handleChangeShelf={(book, newShelf) => this.changeShelf(book, newShelf)}
              />
            </div>

            <Link to='/search'className="open-search">
              <button>Add a book</button>
            </Link>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp