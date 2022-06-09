### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(ch4)

<br/>

---

<br/>

### 🛠 . Server - GraphQL(ch4)

- GraphQL 환경세팅 및 schema 작성
- resolver 작성
- GraphQL Playground 소개 및 동작 테스트

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

1. ApolloServer(graphql) 정의

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

// REST_API와 가장 큰 차이점 => path가 오직 "/graphql"으로, resolvers를 통해 요청한 데이터들이 나눠지게 됨
// graphql Playground의 cors 설정을 위해 "https://studio.apollographql.com" 추가
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

2. schema 정의

```javascript
// server/src/schema/message.js

import { gql } from "apollo-server-express";

const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    userId: ID!
    timestamp: Float #13자리 숫자
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

3. resolvers 정의
   - parent: parent 객체. 거의 사용X
   - args: Query에 필요한 필드에 제공되는 인수(parameter)
   - context: 로그인한 사용자. DB Access 등의 중요한 정보들

```javascript
// server/src/resolvers/message.js

import { v4 } from "uuid";
import { writeDB } from "../dbController.js";

const setMsgs = (data) => writeDB("messages", data);

/* 
parent: parent 객체. 거의 사용X
args: Query에 필요한 필드에 제공되는 인수(parameter)
context: 로그인한 사용자. DB Access 등의 중요한 정보들
*/

// schema에서 정의했던 명령어들 참고(Query, Mutation)
// context는 src/index.js context와 같음
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
      if (!userId) throw Error("사용자가 없습니다.");
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
      if (targetIndex < 0) throw Error("메시지가 없습니다.");
      if (db.messages[targetIndex].userId !== userId)
        throw Error("사용자가 다릅니다.");

      const newMsg = { ...db.messages[targetIndex], text };
      db.messages.splice(targetIndex, 1, newMsg);
      setMsgs(db.messages);
      return newMsg;
    },

    deleteMessage: (parent, { id, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw "메시지가 없습니다.";
      if (db.messages[targetIndex].userId !== userId)
        throw "사용자가 다릅니다.";
      db.messages.splice(targetIndex, 1);
      setMsgs(db.messages);
      return id;
    },
  },
};

export default messageResolver;
```

<br/>

4. Playground에서 데이터 통신
   - schema 정의 참조

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
  "text": "테스트1"
  "userId": "roy",
}
```
