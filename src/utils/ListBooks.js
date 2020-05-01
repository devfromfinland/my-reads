/**
* @description Represents a list of book in one category or all categories
* @param {array} props.listBooks - The array of book objects
* @param {string} props.category - The category to be shown
* @param {function} props.handleChangeShelf - Function to handle the book's action (move to a specific shelf)
*/

import React from 'react'
import Book from './Book'
import PropTypes from 'prop-types'

function ListBooks(props) {
  let contentToShow = 'Nothing to show here';

  //console.log(JSON.stringify(props));
  // console.log('listBook: ', typeof(props.listBooks));

  // TODO: Check if props.listBooks is valid and has content
  if (props.listBooks && props.listBooks.length > 0) {
    // TODO: Check if there is any props with category name. If 'yes', list books by category name. If 'no', show books from all categories
    if (props.category && props.category.length > 0) {
      let filteredBooks = props.listBooks.filter((c) => (c.shelf === props.category));

      // TODO: Check if the shelf is empty
      (filteredBooks.length > 0)
        ? contentToShow = filteredBooks.map((book) => (
          <li key={book.id}>
            <Book book={book} handleChangeShelf={(book, newShelf) => props.handleChangeShelf(book, newShelf)}/>
          </li>
        ))
        : contentToShow = 'Nothing to show here'
    } else {
      // TODO: Show books from all categories
      contentToShow = props.listBooks.map((book) => (
        <li key={book.id}>
          <Book book={book} handleChangeShelf={(book, newShelf) => props.handleChangeShelf(book, newShelf)}/>
        </li>
      ));
    }
  }

  return (
    <ol className="books-grid">
      {/* Contents will be 'Nothing to show here' if there is no book in the category or no search results
      Contents will be a list of books in the same category or in all categories */}
      { contentToShow }
    </ol>
  )
}

ListBooks.propTypes = {
  listBooks: PropTypes.array,
  category: PropTypes.string,
  handleChangeShelf: PropTypes.func.isRequired,
};

export default ListBooks;