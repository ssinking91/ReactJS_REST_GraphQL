import express from "express";
import { ApolloServer } from "apollo-server-express";
import resolvers from "./resolvers/index.js";
import schema from "./schema/index.js";
import { readDB } from "./dbController.js";

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    db: {
      messages: readDB("messages"),
      users: readDB("users"),
    },
  },
});

const app = express();

await server.start();

// REST_API와 가장 큰 차이점 => path가 오직 "/graphql"으로, resolvers를 통해 요청한 데이터들이 나눠지게 됨
// graphql Playground의 cors 설정을 위해 "https://studio.apollographql.com" 추가
server.applyMiddleware({
  app,
  path: "/graphql",
  cors: {
    origin: ["http://localhost:3000", "https://studio.apollographql.com"],
    credentials: true,
  },
});

await app.listen({ port: 8000 });
console.log("server listening on 8000...");
