const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, arg, context) => {
            if (context.user) {
            return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('No user login detected: please log in...');
        },
        // books: async (parent, { username }) => {
        //     const params = username ? { username } : {};
        //     return Book.find(params).sort({ createdAt: -1 });
        // },
    },

    Mutation: {
        login : async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Email address not found in our records: Please try again')
            }

            const correctPW = await user.isCorrectPassword(password);

            if (!correctPW) {
                throw new AuthenticationError('Incorrect: Please try again')
            }

            const token = signToken(user);

            return { token, user };
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { user, body }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id},
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                )
                return updatedUser;
            }
            throw new AuthenticationError('Error: Book was not added');
        },
        removeBook: async (parent, { user, params }, context ) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { saveBooks: { bookId: params.bookId } } },
                    { new: true }
                );
                
                if (!updatedUser) {
                    throw new AuthenticationError('No user found under specified ID');
                }
            }
        }
    }
};

module.exports = resolvers;