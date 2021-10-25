import { gql } from '@apollo/client';

export const GET_ME = gql`
    query user($username: String!) {
        _id
        username
        email
        saveBooks {
            authors
            description
            bookId
            image
            link
            title
        }
    }
`;