const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: String
        savedBooks: [bookSchema]
    }

    type Book {
        bookId: ID!
        authors: { String }
        description: String
        title: String
        image: ID
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: [User]
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        adduser(username: String!, email: String!, password: String!): Auth
        savebook(authors: String!, description: String!, title: String!, bookId: ID!, image: ID!, link: String!): User
        removebook(bookId: ID!): User
    }
`