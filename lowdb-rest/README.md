### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(lowdb-rest)

<br/>

---

<br/>

### 🛠 . LowDB_REST

- LowDB_REST

---

<br/>

- cd lowdb-rest
- cd server

```jsx
// lowdb-rest/server

yarn add lowdb
```

---

<br/>

- [lowdb](https://hyungju-lee.github.io/hyungju-lee2021_2.github.io/categories/study/react_restapi_graphql/react_restapi_graphql8.html)
  - json 파일 기반 데이터베이스로 쉽고 빠르게 DB의 기능을 구현할 수 있도록 도와주는 모듈

1. dbController 변경 및 db.json 생성

```javascript
// lowdb-rest/server/src/dbController.js

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

2. routes 변경

```javascript
// lowdb-rest/server/src/routes/messages.js

import { v4 } from "uuid";
import db from "../dbController.js";

const getMsgs = () => {
  // lowdb에서 제공하는 기능입니다. db.read(); 메소드는 db 자체를 읽어오는 기능을 수행합니다.
  db.read();

  // 이 db는 계속 캐시에 남아있는 상태여서, 만약에 db.data가 있으면 db.data를 계속해서 사용하고
  // 없을 경우에는 messages를 다시 빈 배열로 만들어주는 안전장치를 마련합니다.
  db.data = db.data || { messages: [] };
  return db.data.messages;
};

const messagesRoute = [
  {
    // GET MESSAGES
    method: "get",
    route: "/messages",
    handler: ({ query: { cursor = "" } }, res) => {
      const msgs = getMsgs();
      const fromIndex = msgs.findIndex((msg) => msg.id === cursor) + 1;
      res.send(msgs.slice(fromIndex, fromIndex + 15));
    },
  },
  {
    // GET MESSAGE
    method: "get",
    route: "/messages/:id",
    handler: ({ params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const msg = msgs.find((m) => m.id === id);
        if (!msg) throw Error("not found");
        res.send(msg);
      } catch (err) {
        res.status(404).send({ error: err });
      }
    },
  },
  {
    // CREATE MESSAGE
    method: "post",
    route: "/messages",
    handler: ({ body }, res) => {
      try {
        if (!body.userId) throw Error("no userId");
        const msgs = getMsgs();
        const newMsg = {
          id: v4(),
          text: body.text,
          userId: body.userId,
          timestamp: Date.now(),
        };
        db.data.messages.unshift(newMsg);
        // db.write() 코드로 db에 쓸 수 있다.
        db.write();
        res.send(newMsg);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
  {
    // UPDATE MESSAGE
    method: "put",
    route: "/messages/:id",
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw "메시지가 없습니다.";
        if (msgs[targetIndex].userId !== body.userId)
          throw "사용자가 다릅니다.";

        const newMsg = { ...msgs[targetIndex], text: body.text };
        db.data.messages.splice(targetIndex, 1, newMsg);
        // db.write() 코드로 db에 쓸 수 있다.
        db.write();
        res.send(newMsg);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
  {
    // DELETE MESSAGE
    method: "delete",
    route: "/messages/:id",
    handler: ({ params: { id }, query: { userId } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw "메시지가 없습니다.";
        if (msgs[targetIndex].userId !== userId) throw "사용자가 다릅니다.";

        db.data.messages.splice(targetIndex, 1);
        db.write();
        res.send(id);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
];

export default messagesRoute;
```

<br/>

3.  nodemon에서 감시하는 대상 변경

```javascript
// lowdb-rest/server/nodemon.json

{
  "watch": ["src"],
  // "ignore": ["db/**/*"],
  "ignore": ["db.json"],
  "env": {
    "NODE_ENV": "development"
  }
}
```
