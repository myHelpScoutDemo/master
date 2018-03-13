import React from 'react'
import { connect } from 'react-redux'
import BooksActions from './_booksActions'
import BookActions from '../book/_bookActions'
import FavoriteBooksActions from '../favoriteBooks/_favoriteBooksActions'
import Loading from '../../common/loading'
import BooksItemSmall from './booksItemSmall'
import BooksItemLarge from './booksItemLarge'
import { Card, Container, Search, Select, Segment } from 'semantic-ui-react'

class BooksContainer extends React.Component {
    componentWillMount() {
        this.props.init()
        this.props.get()
    }

    renderSearchBar() {
        return (
            <Segment.Group horizontal>
                <Search
                    fluid
                    input="text"
                    icon="search"
                    value={ this.props.searchTerm }
                    open={ false }
                    loading={ this.props.isLoading }
                    onSearchChange={ (event, { value }) => this.props.setSearchTerm(value) }
                />

                <Select
                    placeholder="View"
                    value={ this.props.view }
                    options={ [
                        {
                            key: 'list',
                            value: 'list',
                            text: 'As List'
                        },
                        {
                            key: 'grid',
                            value: 'grid',
                            text: 'As Grid'
                        }
                    ] }
                    onChange={ (event, { value }) => this.props.setView(value) }
                />
                <Select
                    placeholder="Order By"
                    value={ this.props.orderBy }
                    options={ [{
                        key: 'asc',
                        value: 'asc',
                        text: 'Title'
                    }, {
                        key: 'desc',
                        value: 'desc',
                        text: 'Title (Reverse)'
                    }, {
                        key: 'oldest',
                        value: 'oldest',
                        text: 'Oldest to Newest'
                    }, {
                        key: 'newest',
                        value: 'newest',
                        text: 'Newest to Oldest'
                    }

                    ] }
                    onChange={ (event, { value }) => this.props.setOrderBy(value) }
                />
            </Segment.Group>
        )
    }

    renderBook(book) {
        const props = {
            ...book,
            key: book.id,
            add: () => this.props.add(book),
            open: () => this.props.open.bind(this, book),
            remove: this.props.remove,
        }

        if (this.props.view === 'grid') {
            return <BooksItemSmall { ...props } />
        } else {
            return <BooksItemLarge { ...props } />
        }
    }

    renderBooks() {
        if (this.props.error) {
            return <div>{ this.props.error } </div>
        } else if (this.props.isLoading) {
            return <div>loading</div>
        } else if (this.props.books.length > 1) {
            return (
                <Container>
                    <Card.Group itemsPerRow={ this.props.view === 'grid' ? 3 : 1 }>
                        {
                            this.props.books.map(book => this.renderBook(book))
                        }
                    </Card.Group>
                </Container>
            )
        } else {
            return <div>No books to display.</div>
        }
    }

    render() {
        return (
            <Container fluid>
                { this.renderSearchBar() }
                { this.renderBooks() }
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        books: state.books.books,
        isLoading: state.books.isLoading,
        searchTerm: state.books.searchTerm,
        orderBy: state.books.orderBy,
        view: state.books.view,
        error: state.books.error
    }
}

function mapDispatchToProps(dispatch) {
    return {
        init(payload) {
            dispatch(BooksActions.init(payload))
        },
        get(payload) {
            dispatch(BooksActions.get(payload))
        },
        open(payload) {
            dispatch(BookActions.open(payload))
        },
        add(payload) {
            dispatch(FavoriteBooksActions.add(payload))
        },
        remove(payload) {
            dispatch(FavoriteBooksActions.remove(payload))
        },
        setOrderBy(payload) {
            dispatch(BooksActions.setOrderBy(payload))
        },
        setSearchTerm(payload) {
            dispatch(BooksActions.setSearchTerm(payload))
        },
        setView(payload) {
            dispatch(BooksActions.setView(payload))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BooksContainer)