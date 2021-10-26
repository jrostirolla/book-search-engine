import { gql } from '@apollo/client';

export const GET_ME = gql`
    query user($username: String!) {
        ID
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