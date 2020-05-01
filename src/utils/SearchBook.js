/**
* @description SearchBook component fetch data from BooksAPI based on query to show results
* @param {array} props.myBooks - The array of book objects, to compare with search results for proper displayed actions
* @param {func} props.handleChangeShelf - Function to handle the book's action (move to a specific shelf)
*/

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from '../BooksAPI'
import ListBooks from './ListBooks'
import PropTypes from 'prop-types'
// import { throttle, debounce } from 'throttle-debounce'
import * as _ from 'underscore'

class SearchBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      results: [],
    }

    this.searchInput = React.createRef();
    this.showSearchResultsThrottled = _.throttle(this.showSearchResults, 1000);
    this.warningMessageThrottled = _.throttle(this.warningMessage, 1000);
  }

  static propTypes = {
    handleChangeShelf: PropTypes.func.isRequired,
    myBooks: PropTypes.array.isRequired,
  }

  componentDidMount() {
    // TODO: Automatically set the focus to search input
    this.searchInput.current.focus();
  }

  handleSearchQuery = (value) => {
    // TODO: Check validity of the query
    let validatedQuery = this.validateQuery(value);

    if (validatedQuery.message === 'OK') {
      this.setState(() => ({
        query: value
      }));

      // TODO: Show results when query is valid
      this.showSearchResultsThrottled(value);
    } else {
      this.setState(() => ({
        query: validatedQuery.newQuery
      }));

      // TODO: Show the warning message about the input
      this.warningMessageThrottled(validatedQuery.message);

      // TODO: Show results with a validated query (or not)
      this.showSearchResultsThrottled(validatedQuery.newQuery);
    }
  }

  validateQuery = (query) => {
    // TODO: Force deep clone a string, then handl the query
    let newQuery = (' ' + query).slice(1);
    let message = '';
    let errorMsg = ''
    let flag = 0;

    // TODO: Check the query for any warning message
    if (newQuery.length > 0) {
      // space before
      if (newQuery[0] === ' ') {
        errorMsg += 'No empty space in the begin<br>';
        flag = 1;
      }
    
      // special character
      let reg = RegExp('[!@#$%^&*(),.?":{}|<>]','g');
      let test = reg.test(newQuery);
      if (test) {
        errorMsg += 'No special character';
        flag = 1;
      }

      // TODO: Handle the query, and return a clean one (no space in the beginning and no special characters)
      newQuery = newQuery.trim().replace(/[^\w\s]/g, '');
    }

    (flag === 0)
      ? message = 'OK'
      : message = errorMsg

    return {newQuery: newQuery, message: message};
  }

  warningMessage = (message) => {
    // TODO: Display the warning
    console.log('Notification: ', message);
  }

  showSearchResults = async (value) => {
    // console.log(value);
    // TODO: Check if the search query is empty
    if (value === '') {
      // TODO: Clear the results in any cases including when user press Backspace
      this.setState(() => ({
        results: []
      }))
    } else {
      // TODO: Fetch data based on the search query
      const books = await BooksAPI.search(value);
      
      this.setState(() => ({
          results: this.screenBooks(books)
      }))
    }
  }

  screenBooks = (books) => {
    if (books && books.length > 0) {

      // TODO: Clone (deep clone) to a new array of books to update its elements
      // let updatedBooks = [...books]; // this is a shallow clone
      let updatedBooks = JSON.parse(JSON.stringify(books));

      // TODO: Go through each book to update the fields properly
      for (let index = 0; index < updatedBooks.length; index++) {

        // FIX: Create an empty 'imageLinks' object if it doesn't exist to avoid error
        if (!updatedBooks[index].imageLinks || !updatedBooks[index].imageLinks['smallThumbnail']) {
          updatedBooks[index].imageLinks = {smallThumbnail: ''}
        }

        // FIX: Create an empty 'authors' array if it doesn't exist to avoid error
        if (!updatedBooks[index].authors || !updatedBooks[index].authors[0]) {
          updatedBooks[index].authors = [''];
        }

        // FIX: Create an empth 'shelf' string if it doesn't exist to show in search results
        if (!updatedBooks[index]) {
          updatedBooks[index].shelf = 'none';
        }

        // TODO: check if each book is currently in any shelf
        // if not exist on any shelf, set its 'shelf' to 'none' or an empty string
        // if exist on a shelf, set its 'shelf' accordingly
        let flag = 0;
        if (this.props.myBooks && this.props.myBooks.length > 0) {
          for (let i = 0; i < this.props.myBooks.length; i++) {
            if (this.props.myBooks[i].id === updatedBooks[index].id) {
              updatedBooks[index].shelf = this.props.myBooks[i].shelf;
              flag = 1;
              break;
            }
          }
        }
        
        // TODO: flag = 0, this book doesn't exist in any shelf
        // set its 'currentSelf' to 'none' or an empty text
        if (flag === 0) {
          updatedBooks[index].shelf = 'none';
        }
      }

      return updatedBooks;
    }

    return [];
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to='/' className="close-search">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={(e) => this.handleSearchQuery(e.target.value)}
              ref={this.searchInput}
            />
            
          </div>
        </div>
        <div className="search-books-results">
          <ListBooks
            listBooks={this.state.results}
            handleChangeShelf={(book, newShelf) => this.props.handleChangeShelf(book, newShelf)}
          />
        </div>
      </div>
    )
  }
}

export default SearchBook;