### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(lowdb-gql)

<br/>

---

<br/>

### ๐  . LowDB_GQL

- LowDB_GQL

---

<br/>

- cd lowdb-gql
- cd server

```jsx
// lowdb-gql/server

yarn add lowdb
```

---

<br/>

- [lowdb](https://hyungju-lee.github.io/hyungju-lee2021_2.github.io/categories/study/react_restapi_graphql/react_restapi_graphql8.html)
  - json ํ์ผ ๊ธฐ๋ฐ ๋ฐ์ดํฐ๋ฒ ์ด์ค๋ก ์ฝ๊ณ  ๋น ๋ฅด๊ฒ DB์ ๊ธฐ๋ฅ์ ๊ตฌํํ  ์ ์๋๋ก ๋์์ฃผ๋ ๋ชจ๋

1. dbController ๋ณ๊ฒฝ ๋ฐ db.json ์์ฑ

```javascript
// lowdb-gql/server/src/dbController.js

// file system, path์ resolve๋ lowdb๊ฐ ์์์ํด์ฃผ๋ฏ๋ก ์ญ์ ํฉ์๋ค.
import { LowSync, JSONFileSync } from "lowdb";

// ๊ฒฝ๋ก๋ฅผ ./src/db.json์ผ๋ก ์ค์ . ๋ชจ๋ ํ๊ณณ์ ๋ญ์น  ๊ฒ๋๋ค.
// ํ์ฌ server/src/db ํด๋์ messages.json, users.json์ด ์๋๋ฐ, ์ด๋ฅผ server/src/db.json ํ์ผ๋ก ํ๋ฐ ๋ฌถ์๋ ค๊ณ  ๊ณํ์ค์๋๋ค.
// server/src/db.json์ด๋ผ๋ ํ๋์ ํ์ผ ์์์ messages, users๊ฐ ๋ชจ๋ ์๋๋ก ํ๊ฒ ์ต๋๋ค.
const adapter = new JSONFileSync("./src/db.json");

// ๊ทธ๋ฆฌ๊ณ  db๋ผ๋ ๊ฑธ ๋ง๋ค๊ฒ๋๋ค.
const db = new LowSync(adapter);

// db์์ ์ด์  write, read๋ผ๋ ๋ช๋ น์ ์ฐ๊ฒ ๋ ๊ฒ๋๋ค.
export default db;
```

<br/>

2. index.js ๋ณ๊ฒฝ

```javascript
// lowdb-gql/server/src/index.js

import express from "express";
import { ApolloServer } from "apollo-server-express";
import resolvers from "./resolvers/index.js";
import schema from "./schema/index.js";
import db from "./dbController.js";

// ์ด ์ํ์์ readDB ๋ผ๋ ํจ์๋ฅผ ๋ค์ ๋ง๋ค๊ฒ ์ต๋๋ค.
// ์๋์ ๊ฐ์ด ์์ฑํ๋ฉด returnํ๋ db.data ์์๋ messages์ users๊ฐ ๋ชจ๋ ๋ค์ด์๋ ์ํ๊ฐ๋๊ฒ ์ฃ ?
const readDB = () => {
  db.read();
  return db.data;
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    // ์๋ ๋ถ๋ถ์ด ์๋์ ๊ฐ์ด ์์ ๋๋ฉด ๋๊ฒ ์ต๋๋ค.
    // ๊ทธ๋ฐ๋ฐ ์๋ db์ ์์ importํด์จ db์ ์ด๋ฆ์ด ๊ฒน์ณ์ resolvers์์ ๋ฌธ์ ๊ฐ๋ ๊ฒ๋๋ค.
    // ๊ทธ๋์ ์๋๋ฅผ models๋ผ๋ ์ด๋ฆ์ผ๋ก ๋ฐ๊ฟ๋๋ค.
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
```

<br/>

3.

```javascript
// lowdb-gql/server/src/resolvers/messages.js

import { v4 } from "uuid";
import db from "../dbController.js";

/* 
parent: parent ๊ฐ์ฒด. ๊ฑฐ์ ์ฌ์ฉX
args: Query์ ํ์ํ ํ๋์ ์ ๊ณต๋๋ ์ธ์(parameter)
context: ๋ก๊ทธ์ธํ ์ฌ์ฉ์. DB Access ๋ฑ์ ์ค์ํ ์ ๋ณด๋ค
*/

const messageResolver = {
  Query: {
    messages: (parent, { cursor = "" }, { models }) => {
      const fromIndex =
        models.messages.findIndex((msg) => msg.id === cursor) + 1;
      return models.messages?.slice(fromIndex, fromIndex + 15) || [];
    },
    message: (parent, { id = "" }, { models }) => {
      return models.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { models }) => {
      if (!userId) throw Error("์ฌ์ฉ์๊ฐ ์์ต๋๋ค.");
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      models.messages.unshift(newMsg);
      // GraphQL์ ์ฅ์ ์ models๋ก ๋ถ๋ฌ์จ ๊ฒ์ด db๋ ๊ณ์ ์ฐ๋์ด๋๊ณ  ์๋ค๋ผ๋ ๋ถ๋ถ์๋๋ค.
      // ๊ทธ๋์ data๊ฐ ๋ณ๊ฒฝ์ด๋์์๋ ๊ทธ models ๊ทธ๋๋ก db๋ฅผ ์ฐ๊ฒ๋ํ๋ db.write() ๋ช๋ น์ด๋ง ์ํํด์ฃผ๋ฉด๋ฉ๋๋ค.
      db.write();
      return newMsg;
    },
    updateMessage: (parent, { id, text, userId }, { models }) => {
      const targetIndex = models.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw Error("๋ฉ์์ง๊ฐ ์์ต๋๋ค.");
      if (models.messages[targetIndex].userId !== userId)
        throw Error("์ฌ์ฉ์๊ฐ ๋ค๋ฆ๋๋ค.");

      const newMsg = { ...models.messages[targetIndex], text };
      models.messages.splice(targetIndex, 1, newMsg);
      // GraphQL์ ์ฅ์ ์ models๋ก ๋ถ๋ฌ์จ ๊ฒ์ด db๋ ๊ณ์ ์ฐ๋์ด๋๊ณ  ์๋ค๋ผ๋ ๋ถ๋ถ์๋๋ค.
      // ๊ทธ๋์ data๊ฐ ๋ณ๊ฒฝ์ด๋์์๋ ๊ทธ models ๊ทธ๋๋ก db๋ฅผ ์ฐ๊ฒ๋ํ๋ db.write() ๋ช๋ น์ด๋ง ์ํํด์ฃผ๋ฉด๋ฉ๋๋ค.
      db.write();
      return newMsg;
    },
    deleteMessage: (parent, { id, userId }, { models }) => {
      const targetIndex = models.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw "๋ฉ์์ง๊ฐ ์์ต๋๋ค.";
      if (models.messages[targetIndex].userId !== userId)
        throw "์ฌ์ฉ์๊ฐ ๋ค๋ฆ๋๋ค.";
      models.messages.splice(targetIndex, 1);
      // GraphQL์ ์ฅ์ ์ models๋ก ๋ถ๋ฌ์จ ๊ฒ์ด db๋ ๊ณ์ ์ฐ๋์ด๋๊ณ  ์๋ค๋ผ๋ ๋ถ๋ถ์๋๋ค.
      // ๊ทธ๋์ data๊ฐ ๋ณ๊ฒฝ์ด๋์์๋ ๊ทธ models ๊ทธ๋๋ก db๋ฅผ ์ฐ๊ฒ๋ํ๋ db.write() ๋ช๋ น์ด๋ง ์ํํด์ฃผ๋ฉด๋ฉ๋๋ค.
      db.write();
      return id;
    },
  },
  Message: {
    user: (msg, args, { models }) => models.users[msg.userId],
  },
};

export default messageResolver;
```

<br/>

4.  nodemon์์ ๊ฐ์ํ๋ ๋์ ๋ณ๊ฒฝ

```javascript
// lowdb-gql/server/nodemon.json

{
  "watch": ["src"],
  // "ignore": ["db/**/*"],
  "ignore": ["db.json"],
  "env": {
    "NODE_ENV": "development"
  }
}
```
