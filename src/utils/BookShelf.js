/**
* @description BookShelf represents book shelves with a list of books in each shelf accordingly
* @param {array} props.listBooks - The array of (object) books
* @param {array} props.shelfTitles - The array of (string) shelf titles 
* @param {func} props.handleChangeShelf - The function to handle change shelf of a book
*/

import React from 'react'
import ListBooks from './ListBooks'
import PropTypes from 'prop-types'

// TODO: Convert category value into readable Text for shelf's title
const textShelf = (value) => {
  switch (value) {
    case 'currentlyReading':
      return 'Currently Reading';
    case 'wantToRead':
      return 'Want to Read';
    case 'read':
      return 'Read';
    default:
      return value;
  }
}

function BookShelf(props) {
  return (
    <div>
      {props.shelfTitles && props.shelfTitles.map((shelf) => (
        <div className="bookshelf" key={shelf}>
          <h2 className="bookshelf-title">{textShelf(shelf)}</h2>
          <div className="bookshelf-books">
            <ListBooks 
              listBooks={props.listBooks} 
              category={shelf} 
              handleChangeShelf={(book, newShelf) => props.handleChangeShelf(book, newShelf)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

BookShelf.propTypes = {
  listBooks: PropTypes.array.isRequired,
  shelfTitles: PropTypes.array.isRequired,
  handleChangeShelf: PropTypes.func.isRequired,
};

export default BookShelf;