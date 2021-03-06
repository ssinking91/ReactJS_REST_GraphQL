### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(server)

---

<br />

### ๐  1. Server - ๊ธฐ๋ณธ๊ธฐ๋ฅ ๊ตฌํ

- express ์๋ฒ ๋ฐ json database ๋ง๋ค๊ธฐ
- routes ์ ์

<br />

### ๐จย 2. ์คํ๋ฐฉ๋ฒ

- cd server
- yarn init -y : package.json ์๋ ์์ฑ

```jsx
// ch2/server

yarn add express cors uuid

yarn add --dev nodemon
```

- cd ..(root folder)

```jsx
// ch2

yarn run server
```

---

- ์คํ์์
  - (1) package.json scripts์ `"start": "nodemon ./src/index.js"` ์คํ
  - (2) ./src/index.js์ express ๊ตฌ๋
  - (3) app.listen(8000, ...)๋ฅผ ํตํด http://localhost:8000/ ๊ตฌ๋

---

### [nodemon ์ฌ์ฉ๋ฒ](https://github.com/remy/nodemon#nodemon)

- nodemon.json์ด ์คํ๋ ๋
  - watch : ์ด๋ค ๊ฒ๋ค์ ๊ฐ์ํด์ ๋ณ๊ฒฝ์ฌํญ์ ๋ฐ์ํ ์ง ์ค์ 
  - ignore : ์ด๋ค ๊ฒ๋ค์ ๋ณ๊ฒฝ๋๋๋ผ๋ ์๋ก๊ณ ์นจ์ ํ์ง ์์์ง ์ค์ 
  - env : ํ๊ฒฝ์ค์ 

```javascript
// nodemon.json
{
  "watch": ["src"],
  "ignore": ["db/**/*"],
  "env": {
    "NODE_ENV": "development"
  }
}
```

---

### [fs์ path](https://opentutorials.org/module/938/7373)

- ํ์ผ ์ฝ๊ธฐ

  - fs.readFile(filename, [options], callback)
  - filename์ ํ์ผ์ [options]์ ๋ฐฉ์์ผ๋ก ์ฝ์ ํ callback์ผ๋ก ์ ๋ฌ๋ ํจ์๋ฅผ ํธ์ถํฉ๋๋ค. (๋น๋๊ธฐ์ )

  - fs.readFileSync(filename, [options])
  - filename์ ํ์ผ์ [options]์ ๋ฐฉ์์ผ๋ก ์ฝ์ ํ ๋ฌธ์์ด์ ๋ฐํํฉ๋๋ค. (๋๊ธฐ์ )

  - Sync๊ฐ ๋ถ์ ๊ฒ์ ๋๊ธฐ์  ์ฝ๊ธฐ, ๋ถ์ง ์์ ๊ฒ์ ๋น๋๊ธฐ์  ์ฝ๊ธฐ์๋๋ค. ํ์ผ์ ์ฝ๋๋ฐ ์๊ฐ์ด ์ค๋ ๊ฑธ๋ฆด ์๋ ์์ต๋๋ค. ๋๊ธฐ์  ์ฝ๊ธฐ๋ก ์ฝ๊ฒ ๋๋ฉด ํ์ผ์ ์ฝ์ผ๋ฉด์ ๋ค๋ฅธ ์์์ ๋์์ ํ  ์ ์์ต๋๋ค. ํ์ง๋ง ๋น๋๊ธฐ์ ์ผ๋ก ์ฝ์ผ๋ฉด ํ์ผ์ ์ฝ์ผ๋ฉด์ ๋ค๋ฅธ ์์๋ ๋์์ ์ํํ  ์ ์๊ณ  ํ์ผ์ ๋ค ์ฝ์ผ๋ฉด ๋งค๊ฐ๋ณ์ callback์ผ๋ก ์ ๋ฌํ ํจ์๊ฐ ํธ์ถ๋ฉ๋๋ค.

  - [options]์๋ ๋ณดํต ์ธ์ฝ๋ฉ ๋ฐฉ์์ด ์ค๊ฒ ๋๋ฉฐ ์น์์๋ utf8์ ์ฃผ๋ก ์ฌ์ฉํฉ๋๋ค.

- ํ์ผ ์ฐ๊ธฐ

  - fs.writeFile(filename, data, [options], callback)
  - filename์ ํ์ผ์ [options]์ ๋ฐฉ์์ผ๋ก data ๋ด์ฉ์ ์ด ํ callback ํจ์๋ฅผ ํธ์ถํฉ๋๋ค. (๋น๋๊ธฐ์ )

  - fs.writeFileSync(filename, data, [options])
  - filename์ ํ์ผ์ [options]์ ๋ฐฉ์์ผ๋ก data ๋ด์ฉ์ ์๋๋ค. (๋๊ธฐ์ )

  - ์ฌ์ฉ๋ฒ์ด๋ ๋๊ธฐ์ /๋น๋๊ธฐ์  ์ฐจ์ด๋ ํ์ผ ์ฝ๊ธฐ ๋ฉ์๋์ ๋น์ทํฉ๋๋ค.

```javascript
// dbController.js

import fs from "fs"; // fs ๋ชจ๋์ FileSystem์ ์ฝ์๋ก ํ์ผ ์ฒ๋ฆฌ์ ๊ด๋ จ๋ Node.js ๋ชจ๋
import { resolve } from "path"; // path ๋ชจ๋์ ํ์ผ๊ณผ ํด๋์ ๊ฒฝ๋ก ์์์ ์ํ ๊ธฐ๋ฅ์ ์ ๊ณตํ๋ Node.js ๊ธฐ๋ณธ ๋ชจ๋

const basePath = resolve(); // ํ์ฌ๊ฒฝ๋ก
const filenames = {
  messages: resolve(basePath, "src/db/messages.json"),
  users: resolve(basePath, "src/db/users.json"),
};

// 1. ํ์ผ ์ฝ๊ธฐ(read)
// fs.readFileSync(filename, [options])
//   - filename์ ํ์ผ์ [options]์ ๋ฐฉ์์ผ๋ก ์ฝ์ ํ ๋ฌธ์์ด์ ๋ฐํํฉ๋๋ค. (๋๊ธฐ์ )
//   - [options]์๋ ๋ณดํต ์ธ์ฝ๋ฉ ๋ฐฉ์์ด ์ค๊ฒ ๋๋ฉฐ ์น์์๋ utf8์ ์ฃผ๋ก ์ฌ์ฉ
// ๋๊ธฐ์  ๋ฐฉ์์ ์์ธ์ฒ๋ฆฌ
//   - ๋๊ธฐ์  ๋ฐฉ์์์๋ ์๋ฐ์คํฌ๋ฆฝํธ์ ์ผ๋ฐ์ ์ธ ์์ธ์ฒ๋ฆฌ ๋ฐฉ์์ธ try ~ catch ๊ตฌ๋ฌธ์ผ๋ก ์ฒ๋ฆฌ
export const readDB = (target) => {
  try {
    return JSON.parse(fs.readFileSync(filenames[target], "utf-8"));
  } catch (err) {
    console.error(err);
  }
};

// 2. ํ์ผ ์ฐ๊ธฐ(write)
// fs.writeFileSync(filename, data, [options])
//   - filename์ ํ์ผ์ [options]์ ๋ฐฉ์์ผ๋ก data ๋ด์ฉ์ ์๋๋ค. (๋๊ธฐ์ )
//   - [options]์๋ ๋ณดํต ์ธ์ฝ๋ฉ ๋ฐฉ์์ด ์ค๊ฒ ๋๋ฉฐ ์น์์๋ utf8์ ์ฃผ๋ก ์ฌ์ฉ
// ๋๊ธฐ์  ๋ฐฉ์์ ์์ธ์ฒ๋ฆฌ
//   - ๋๊ธฐ์  ๋ฐฉ์์์๋ ์๋ฐ์คํฌ๋ฆฝํธ์ ์ผ๋ฐ์ ์ธ ์์ธ์ฒ๋ฆฌ ๋ฐฉ์์ธ try ~ catch ๊ตฌ๋ฌธ์ผ๋ก ์ฒ๋ฆฌ
export const writeDB = (target, data) => {
  try {
    return fs.writeFileSync(filenames[target], JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

// __filename : ํ์ฌ ํ์ผ ๊ฒฝ๋ก
// __dirname : ํ์ฌ ํด๋ ๊ฒฝ๋ก
```

- nodeJS ํ๊ฒฝ์์๋ ๊ธฐ๋ณธ์ ์ผ๋ก javascript es6์์ ์ ๊ณตํ๋ ๋ชจ๋ ๋ฌธ๋ฒ์ ์ฌ์ฉํ  ์ ์์
- ๊ธฐ๋ณธ์ ์ผ๋ก๋ require()๋ฌธ๋ฒ์ ์ฌ์ฉํด์ผ ํจ
- nodeJS ํ๊ฒฝ์์๋ javascript es6์์ ์ ๊ณตํ๋ ๋ชจ๋๋ฌธ๋ฒ์ ์ฌ์ฉํ๋ ค๋ฉด `package.json์ "type": "module" ์ถ๊ฐ`ํ ๊ฒ => `nodeJS import export ๋ฌธ๋ฒ์ ์ฌ์ฉํ  ์ ์์`

```javascript
{
  "name": "server",
  "type": "module",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "uuid": "^8.3.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.7"
  },
  "scripts": {
    "start": "nodemon ./src/index.js"
  }
}
```

---

### [express](https://kirkim.github.io/javascript/2021/10/16/body_parser.html)

- Node.js๋ฅผ ์ํ ๋น ๋ฅด๊ณ  ๊ฐ๋ฐฉ์ ์ธ ๊ฐ๊ฒฐํ ์น ํ๋ ์์ํฌ

```javascript
//index.js

import express from "express";
import cors from "cors";
import messagesRoute from "./routes/messages.js";
import usersRoute from "./routes/users.js";

const app = express();

// ํด๋ผ์ด์ธํธ๋ก ๋ถํฐ ๋ฐ์ http ์์ฒญ ๋ฉ์์ง ํ์์์ body๋ฐ์ดํฐ๋ฅผ ํด์ํ๊ธฐ ์ํด์
//  - express.urlencoded()์ express.json()๋ก ์ฒ๋ฆฌ๊ฐ ํ์
// ๊ฒฐ๋ก 
//  - .urlencoded()์ x-www-form-urlencoded ํํ์ ๋ฐ์ดํฐ๋ฅผ
//  - .json()์ JSONํํ์ ๋ฐ์ดํฐ๋ฅผ ํด์ํ์ฌ ์ฌ์ฉ
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ํน์  ๋๋ฉ์ธ์๋ง ํ์ฉํ๊ธฐ
//  - cors: ํด๋น ๋๋ฉ์ธ์ ์ ํ ์์ด ํด๋น ์๋ฒ์ ์์ฒญ์ ๋ณด๋ด๊ณ  ์๋ต์ ๋ฐ์ ์ ์์
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// route
const routes = [...messagesRoute, ...usersRoute];

// Syntax : app.[method](route, handler)
routes.forEach(({ method, route, handler }) => {
  app[method](route, handler);
});

// ์ฑ์ ์๋ฒ๋ฅผ ์์ํ๋ฉฐ 8000 ํฌํธ์์ ์ฐ๊ฒฐ์ ์ฒญ์ทจ
// Syntax : app.listen([port], [host], [backlog], [callback])
app.listen(8000, () => {
  console.log("server listening on 8000...");
});

// route
// Syntax : app.[method](route, handler)
```

<br/>

- [Express] app.listen ๊ณผ http.createServer(app) ์ ์ฐจ์ด

```javascript
/* express ๋ชจ๋๋ก listen ์ผ๋ก ๋ฑ๋กํ๊ธฐ */

var express = require("express");
var app = express();

app.listen(3000);
```

<br/>

```javascript
var express = require("express");
var http = require("http");

var app = express();
var server = http.createServer(app);

server.listen(3000);
```

<br/>

```javascript
app.listen = function () {
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};
```

---

- DB ์ค์ 
  - routes
  - Syntax : app.[method](route, handler)

```javascript
// src/routes/messages.js

import { v4 } from "uuid";
import { readDB, writeDB } from "../dbController.js";

// DB ์ค์ 
const getMsgs = () => readDB("messages");
const setMsgs = (data) => writeDB("messages", data);

// route
// Syntax : app.[method](route, handler)

const messagesRoute = [
  {
    // GET MESSAGES
    method: "get",
    route: "/messages",
    handler: (req, res) => {
      const msgs = getMsgs();
      res.send(msgs);
    },
  },
  {
    // GET MESSAGE
    method: "get",
    route: "/messages/:id",
    // req = { body, params, query }
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
    // req = { body, params, query }
    handler: ({ body }, res) => {
      const msgs = getMsgs();
      const newMsg = {
        id: v4(),
        text: body.text,
        userId: body.userId,
        timestamp: Date.now(),
      };
      msgs.unshift(newMsg);
      setMsgs(msgs);
      res.send(newMsg);
    },
  },
  {
    // UPDATE MESSAGE
    method: "put",
    route: "/messages/:id",
    // req = { body, params, query }
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw "๋ฉ์์ง๊ฐ ์์ต๋๋ค.";
        if (msgs[targetIndex].userId !== body.userId)
          throw "์ฌ์ฉ์๊ฐ ๋ค๋ฆ๋๋ค.";

        const newMsg = { ...msgs[targetIndex], text: body.text };
        msgs.splice(targetIndex, 1, newMsg);
        setMsgs(msgs);
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
    // req = { body, params, query }
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw "๋ฉ์์ง๊ฐ ์์ต๋๋ค.";
        if (msgs[targetIndex].userId !== body.userId)
          throw "์ฌ์ฉ์๊ฐ ๋ค๋ฆ๋๋ค.";

        msgs.splice(targetIndex, 1);
        setMsgs(msgs);
        res.send(id);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
];

export default messagesRoute;
```
