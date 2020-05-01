/**
* @description Represents a book
* @param {object} props.book - The book object
* @param {string} props.book.id - The book ID
* @param {string} props.book.title - The title of the book
* @param {string} props.book.authors - The authors of the book
* @param {string} props.book.imageLinks.smallThumbnail - The link to the book's cover
* @param {string} props.book.shelf - The current shelf where the book is located
* @param {function} props.handleChangeShelf - Function to change the shelf of a book
*/

import React from 'react'
import PropTypes from 'prop-types'

function Book(props) {

  // TODO: Merge many authors into one author string
  let combinedAuthors = '';
  if (props.book.authors && props.book.authors[0]) {
    combinedAuthors = props.book.authors[0];
    for (let j = 1; j < props.book.authors.length; j++) {
      combinedAuthors += ' & ' + props.book.authors[j];
    }
  }

  return (
    <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url(' + props.book.imageLinks.smallThumbnail + ')' }}></div>

        {/* TODO: highlight the current shelf of the book when options are shown */}
        <div className="book-shelf-changer">
          <select value={props.book.shelf} onChange={(e) => props.handleChangeShelf(props.book, e.target.value)}>
            <option value="move" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>

      </div>
      <div className="book-title">{props.book.title}</div>
      <div className="book-authors">{combinedAuthors}</div>
    </div>
  )
}

Book.propTypes = {
  book: PropTypes.object.isRequired,
  handleChangeShelf: PropTypes.func.isRequired,
};

export default Book;