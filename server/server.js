const express = require("express");
const path = require("path");
//addition of ApolloServer
const { ApolloServer } = require("apollo-server-express");
const db = require("./config/connection");
// const routes = require('./routes');
//Addition of typeDefs, resolvers and authMiddleware functionality
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 8080;
//Added server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

//addition of middleware functions
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.use(routes);
//Addition of building software for dev folders
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
