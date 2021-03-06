### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(lowdb-rest)

<br/>

---

<br/>

### ๐  . LowDB_REST

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
  - json ํ์ผ ๊ธฐ๋ฐ ๋ฐ์ดํฐ๋ฒ ์ด์ค๋ก ์ฝ๊ณ  ๋น ๋ฅด๊ฒ DB์ ๊ธฐ๋ฅ์ ๊ตฌํํ  ์ ์๋๋ก ๋์์ฃผ๋ ๋ชจ๋

1. dbController ๋ณ๊ฒฝ ๋ฐ db.json ์์ฑ

```javascript
// lowdb-rest/server/src/dbController.js

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

2. routes ๋ณ๊ฒฝ

```javascript
// lowdb-rest/server/src/routes/messages.js

import { v4 } from "uuid";
import db from "../dbController.js";

const getMsgs = () => {
  // lowdb์์ ์ ๊ณตํ๋ ๊ธฐ๋ฅ์๋๋ค. db.read(); ๋ฉ์๋๋ db ์์ฒด๋ฅผ ์ฝ์ด์ค๋ ๊ธฐ๋ฅ์ ์ํํฉ๋๋ค.
  db.read();

  // ์ด db๋ ๊ณ์ ์บ์์ ๋จ์์๋ ์ํ์ฌ์, ๋ง์ฝ์ db.data๊ฐ ์์ผ๋ฉด db.data๋ฅผ ๊ณ์ํด์ ์ฌ์ฉํ๊ณ 
  // ์์ ๊ฒฝ์ฐ์๋ messages๋ฅผ ๋ค์ ๋น ๋ฐฐ์ด๋ก ๋ง๋ค์ด์ฃผ๋ ์์ ์ฅ์น๋ฅผ ๋ง๋ จํฉ๋๋ค.
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
        // db.write() ์ฝ๋๋ก db์ ์ธ ์ ์๋ค.
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
        if (targetIndex < 0) throw "๋ฉ์์ง๊ฐ ์์ต๋๋ค.";
        if (msgs[targetIndex].userId !== body.userId)
          throw "์ฌ์ฉ์๊ฐ ๋ค๋ฆ๋๋ค.";

        const newMsg = { ...msgs[targetIndex], text: body.text };
        db.data.messages.splice(targetIndex, 1, newMsg);
        // db.write() ์ฝ๋๋ก db์ ์ธ ์ ์๋ค.
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
        if (targetIndex < 0) throw "๋ฉ์์ง๊ฐ ์์ต๋๋ค.";
        if (msgs[targetIndex].userId !== userId) throw "์ฌ์ฉ์๊ฐ ๋ค๋ฆ๋๋ค.";

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

3.  nodemon์์ ๊ฐ์ํ๋ ๋์ ๋ณ๊ฒฝ

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
