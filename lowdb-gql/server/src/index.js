import express from "express";
import { ApolloServer } from "apollo-server-express";
import resolvers from "./resolvers/index.js";
import schema from "./schema/index.js";
import db from "./dbController.js";

// 이 상태에서 readDB 라는 함수를 다시 만들겠습니다.
// 아래와 같이 작성하면 return하는 db.data 안에는 messages와 users가 모두 들어있는 상태가되겠죠?
const readDB = () => {
  db.read();
  return db.data;
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    // 아래 부분이 아래와 같이 수정되면 되겠습니다.
    // 그런데 아래 db와 위에 import해온 db와 이름이 겹쳐서 resolvers에서 문제가될겁니다.
    // 그래서 아래를 models라는 이름으로 바꿉니다.
    models: readDB(),
  },
});

const app = express();
await server.start();
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
