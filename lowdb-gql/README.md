### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(lowdb-gql)

<br/>

---

<br/>

### 🛠 . LowDB_GQL

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
  - json 파일 기반 데이터베이스로 쉽고 빠르게 DB의 기능을 구현할 수 있도록 도와주는 모듈

1. dbController 변경 및 db.json 생성

```javascript
// lowdb-gql/server/src/dbController.js

// file system, path의 resolve는 lowdb가 알아서해주므로 삭제합시다.
import { LowSync, JSONFileSync } from "lowdb";

// 경로를 ./src/db.json으로 설정. 모두 한곳에 뭉칠 겁니다.
// 현재 server/src/db 폴더에 messages.json, users.json이 있는데, 이를 server/src/db.json 파일로 한데 묶을려고 계획중입니다.
// server/src/db.json이라는 하나의 파일 안에서 messages, users가 모두 있도록 하겠습니다.
const adapter = new JSONFileSync("./src/db.json");

// 그리고 db라는 걸 만들겁니다.
const db = new LowSync(adapter);

// db에서 이제 write, read라는 명령을 쓰게 될겁니다.
export default db;
```

<br/>

2. index.js 변경

```javascript
// lowdb-gql/server/src/index.js

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
```

<br/>

3.

```javascript
// lowdb-gql/server/src/resolvers/messages.js

import { v4 } from "uuid";
import db from "../dbController.js";

/* 
parent: parent 객체. 거의 사용X
args: Query에 필요한 필드에 제공되는 인수(parameter)
context: 로그인한 사용자. DB Access 등의 중요한 정보들
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
      if (!userId) throw Error("사용자가 없습니다.");
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      models.messages.unshift(newMsg);
      // GraphQL의 장점은 models로 불러온 것이 db랑 계속 연동이되고 있다라는 부분입니다.
      // 그래서 data가 변경이되었을때 그 models 그대로 db를 쓰게끔하는 db.write() 명령어만 수행해주면됩니다.
      db.write();
      return newMsg;
    },
    updateMessage: (parent, { id, text, userId }, { models }) => {
      const targetIndex = models.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw Error("메시지가 없습니다.");
      if (models.messages[targetIndex].userId !== userId)
        throw Error("사용자가 다릅니다.");

      const newMsg = { ...models.messages[targetIndex], text };
      models.messages.splice(targetIndex, 1, newMsg);
      // GraphQL의 장점은 models로 불러온 것이 db랑 계속 연동이되고 있다라는 부분입니다.
      // 그래서 data가 변경이되었을때 그 models 그대로 db를 쓰게끔하는 db.write() 명령어만 수행해주면됩니다.
      db.write();
      return newMsg;
    },
    deleteMessage: (parent, { id, userId }, { models }) => {
      const targetIndex = models.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw "메시지가 없습니다.";
      if (models.messages[targetIndex].userId !== userId)
        throw "사용자가 다릅니다.";
      models.messages.splice(targetIndex, 1);
      // GraphQL의 장점은 models로 불러온 것이 db랑 계속 연동이되고 있다라는 부분입니다.
      // 그래서 data가 변경이되었을때 그 models 그대로 db를 쓰게끔하는 db.write() 명령어만 수행해주면됩니다.
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

4.  nodemon에서 감시하는 대상 변경

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
