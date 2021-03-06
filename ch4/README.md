### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(ch4)

<br/>

---

<br/>

### ๐  . Server - GraphQL(ch4)

- GraphQL ํ๊ฒฝ์ธํ ๋ฐ schema ์์ฑ
- resolver ์์ฑ
- GraphQL Playground ์๊ฐ ๋ฐ ๋์ ํ์คํธ

---

<br/>

- cd ch4
- cd server

```jsx
// ch4/server

yarn add apollo-server apollo-server-express graphql
```

---

<br/>

1. ApolloServer(graphql) ์ ์

```javascript
// server/src/index.js

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

// REST_API์ ๊ฐ์ฅ ํฐ ์ฐจ์ด์  => path๊ฐ ์ค์ง "/graphql"์ผ๋ก, resolvers๋ฅผ ํตํด ์์ฒญํ ๋ฐ์ดํฐ๋ค์ด ๋๋ ์ง๊ฒ ๋จ
// graphql Playground์ cors ์ค์ ์ ์ํด "https://studio.apollographql.com" ์ถ๊ฐ
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

2. schema ์ ์

```javascript
// server/src/schema/message.js

import { gql } from "apollo-server-express";

const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    userId: ID!
    timestamp: Float #13์๋ฆฌ ์ซ์
  }

  extend type Query {
    messages: [Message!]! # getMessages
    message(id: ID!): Message! # getMessage
  }

  extend type Mutation {
    createMessage(text: String!, userId: ID!): Message!
    updateMessage(id: ID!, text: String!, userId: ID!): Message!
    deleteMessage(id: ID!, userId: ID!): ID!
  }
`;

export default messageSchema;
```

<br/>

3. resolvers ์ ์
   - parent: parent ๊ฐ์ฒด. ๊ฑฐ์ ์ฌ์ฉX
   - args: Query์ ํ์ํ ํ๋์ ์ ๊ณต๋๋ ์ธ์(parameter)
   - context: ๋ก๊ทธ์ธํ ์ฌ์ฉ์. DB Access ๋ฑ์ ์ค์ํ ์ ๋ณด๋ค

```javascript
// server/src/resolvers/message.js

import { v4 } from "uuid";
import { writeDB } from "../dbController.js";

const setMsgs = (data) => writeDB("messages", data);

/* 
parent: parent ๊ฐ์ฒด. ๊ฑฐ์ ์ฌ์ฉX
args: Query์ ํ์ํ ํ๋์ ์ ๊ณต๋๋ ์ธ์(parameter)
context: ๋ก๊ทธ์ธํ ์ฌ์ฉ์. DB Access ๋ฑ์ ์ค์ํ ์ ๋ณด๋ค
*/

// schema์์ ์ ์ํ๋ ๋ช๋ น์ด๋ค ์ฐธ๊ณ (Query, Mutation)
// context๋ src/index.js context์ ๊ฐ์
const messageResolver = {
  Query: {
    messages: (parent, args, { db }) => {
      // console.log({ parent, args, context })
      return db.messages;
    },

    message: (parent, { id = "" }, { db }) => {
      return db.messages.find((msg) => msg.id === id);
    },
  },

  Mutation: {
    createMessage: (parent, { text, userId }, { db }) => {
      if (!userId) throw Error("์ฌ์ฉ์๊ฐ ์์ต๋๋ค.");
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      db.messages.unshift(newMsg);
      setMsgs(db.messages);
      return newMsg;
    },

    updateMessage: (parent, { id, text, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw Error("๋ฉ์์ง๊ฐ ์์ต๋๋ค.");
      if (db.messages[targetIndex].userId !== userId)
        throw Error("์ฌ์ฉ์๊ฐ ๋ค๋ฆ๋๋ค.");

      const newMsg = { ...db.messages[targetIndex], text };
      db.messages.splice(targetIndex, 1, newMsg);
      setMsgs(db.messages);
      return newMsg;
    },

    deleteMessage: (parent, { id, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw "๋ฉ์์ง๊ฐ ์์ต๋๋ค.";
      if (db.messages[targetIndex].userId !== userId)
        throw "์ฌ์ฉ์๊ฐ ๋ค๋ฆ๋๋ค.";
      db.messages.splice(targetIndex, 1);
      setMsgs(db.messages);
      return id;
    },
  },
};

export default messageResolver;
```

<br/>

4. Playground์์ ๋ฐ์ดํฐ ํต์ 
   - schema ์ ์ ์ฐธ์กฐ

```javascript
// query Operation
query Messages {
 messages {
   id
   text
   userId
   timestamp
 }
}

// mutation Operation
mutation Message($text: String!, $userId: ID!) {
 createMessage(text: $text, userId: $userId) {
   id
   text
   userId
   timestamp
 }
}

// mutation Variables(Headers)
{
  "text": "ํ์คํธ1"
  "userId": "roy",
}
```
