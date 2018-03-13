import BOOKS from './_booksTypes'
import { sortBy } from 'lodash'
import queryString from 'query-string'

// get initial state from URL
const { searchTerm, orderBy, view } = queryString.parse(window.location.hash)

const initialState = {
    books: [],
    cancelableRequest: () => { },
    isLoading: false,
    orderBy,
    searchTerm,
    view,
    error: ''
}

function sortBooks(books, orderBy) {
    function sort(key) {
        return sortBy(books, [function (book) {
            return book.volumeInfo[key]
        }])
    }

    if (!orderBy) {
        return books
    } else if (orderBy === 'asc') {
        return sort('title')
    } else if (orderBy === 'desc') {
        return sort('title').reverse()
    } else if (orderBy === 'oldest') {
        return sort('publishedDate')
    } else if (orderBy === 'newest') {
        return sort('publishedDate').reverse()
    }
}

export default function BooksReducer(state = initialState, action) {
    const { payload, type } = action

    switch (type) {
        case BOOKS.INIT: {
            return {
                ...state,
                books: [],
                isLoading: false,
                orderBy: payload.orderBy || '', // empty strings, because the #hash of uri will display 'undefined'
                searchTerm: payload.searchTerm || '',
                view: payload.view || ''
            }
        }
        case BOOKS.GET_REQUESTED: {
            return {
                ...state,
                books: [],
                isLoading: true,
                error: '',
                cancelableRequest: payload //tracks the request, in case a new one comes, can cancel it
            }
        }
        case BOOKS.GET_SUCCEEDED: {
            return {
                ...state,
                books: sortBooks(payload.books, state.orderBy),
                isLoading: false,
                error: ''
            }
        }
        case BOOKS.GET_FAILED: {
            return {
                ...state,
                isLoading: false,
                books: [],
                error: payload
            }
        }
        case BOOKS.SET_SEARCH_TERM: {
            return {
                ...state,
                searchTerm: payload
            }
        }
        case BOOKS.SET_ORDER_BY: {
            return {
                ...state,
                books: sortBooks(state.books, payload),
                orderBy: payload
            }
        }
        case BOOKS.SET_VIEW: {
            return {
                ...state,
                view: payload
            }
        }
        default: {
            return state
        }
    }
}
