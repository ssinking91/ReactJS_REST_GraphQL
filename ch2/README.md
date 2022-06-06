### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기

---

### 🔨 2. 실행방법(server)

- cd server
- yarn init -y : package.json 자동 생성

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

- 실행순서
  - (1) package.json scripts의 `"start": "nodemon ./src/index.js"` 실행
  - (2) ./src/index.js의 express 구동
  - (3) app.listen(8000, ...)를 통해 http://localhost:8000/ 구독

---

### [nodemon 사용법](https://github.com/remy/nodemon#nodemon)

- nodemon.json이 실행될때
  - watch : 어떤 것들을 감시해서 변경사항을 반영할지 설정
  - ignore : 어떤 것들을 변경되더라도 새로고침은 하지 않을지 설정
  - env : 환경설정

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

### [fs와 path](https://opentutorials.org/module/938/7373)

- 파일 읽기

  - fs.readFile(filename, [options], callback)
  - filename의 파일을 [options]의 방식으로 읽은 후 callback으로 전달된 함수를 호출합니다. (비동기적)

  - fs.readFileSync(filename, [options])
  - filename의 파일을 [options]의 방식으로 읽은 후 문자열을 반환합니다. (동기적)

  - Sync가 붙은 것은 동기적 읽기, 붙지 않은 것은 비동기적 읽기입니다. 파일을 읽는데 시간이 오래 걸릴 수도 있습니다. 동기적 읽기로 읽게 되면 파일을 읽으면서 다른 작업을 동시에 할 수 없습니다. 하지만 비동기적으로 읽으면 파일을 읽으면서 다른 작업도 동시에 수행할 수 있고 파일을 다 읽으면 매개변수 callback으로 전달한 함수가 호출됩니다.

  - [options]에는 보통 인코딩 방식이 오게 되며 웹에서는 utf8을 주로 사용합니다.

- 파일 쓰기

  - fs.writeFile(filename, data, [options], callback)
  - filename의 파일에 [options]의 방식으로 data 내용을 쓴 후 callback 함수를 호출합니다. (비동기적)

  - fs.writeFileSync(filename, data, [options])
  - filename의 파일에 [options]의 방식으로 data 내용을 씁니다. (동기적)

  - 사용법이나 동기적/비동기적 차이는 파일 읽기 메소드와 비슷합니다.

```javascript
// dbController.js

import fs from "fs"; // fs 모듈은 FileSystem의 약자로 파일 처리와 관련된 Node.js 모듈
import { resolve } from "path"; // path 모듈은 파일과 폴더의 경로 작업을 위한 기능을 제공하는 Node.js 기본 모듈

const basePath = resolve(); // 현재경로
const filenames = {
  messages: resolve(basePath, "src/db/messages.json"),
  users: resolve(basePath, "src/db/users.json"),
};

// 1. 파일 읽기(read)
// fs.readFileSync(filename, [options])
//   - filename의 파일을 [options]의 방식으로 읽은 후 문자열을 반환합니다. (동기적)
//   - [options]에는 보통 인코딩 방식이 오게 되며 웹에서는 utf8을 주로 사용
// 동기적 방식의 예외처리
//   - 동기적 방식에서는 자바스크립트의 일반적인 예외처리 방식인 try ~ catch 구문으로 처리
export const readDB = (target) => {
  try {
    return JSON.parse(fs.readFileSync(filenames[target], "utf-8"));
  } catch (err) {
    console.error(err);
  }
};

// 2. 파일 쓰기(write)
// fs.writeFileSync(filename, data, [options])
//   - filename의 파일에 [options]의 방식으로 data 내용을 씁니다. (동기적)
//   - [options]에는 보통 인코딩 방식이 오게 되며 웹에서는 utf8을 주로 사용
// 동기적 방식의 예외처리
//   - 동기적 방식에서는 자바스크립트의 일반적인 예외처리 방식인 try ~ catch 구문으로 처리
export const writeDB = (target, data) => {
  try {
    return fs.writeFileSync(filenames[target], JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

// __filename : 현재 파일 경로
// __dirname : 현재 폴더 경로
```

- nodeJS 환경에서는 기본적으로 javascript es6에서 제공하는 모듈 문법을 사용할 수 없음
- 기본적으로는 require()문법을 사용해야 함
- nodeJS 환경에서는 javascript es6에서 제공하는 모듈문법을 사용하려면 `package.json의 "type": "module" 추가`할것 => `nodeJS import export 문법을 사용할 수 있음`

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

- Node.js를 위한 빠르고 개방적인 간결한 웹 프레임워크

```javascript
//index.js

import express from "express";
import cors from "cors";
import messagesRoute from "./routes/messages.js";
import usersRoute from "./routes/users.js";

const app = express();

// 클라이언트로 부터 받은 http 요청 메시지 형식에서 body데이터를 해석하기 위해서
//  - express.urlencoded()와 express.json()로 처리가 필요
// 결론
//  - .urlencoded()은 x-www-form-urlencoded 형태의 데이터를
//  - .json()은 JSON형태의 데이터를 해석하여 사용
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 특정 도메인에만 허용하기
//  - cors: 해당 도메인은 제한 없이 해당 서버에 요청을 보내고 응답을 받을 수 있음
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

// 앱은 서버를 시작하며 8000 포트에서 연결을 청취
// Syntax : app.listen([port], [host], [backlog], [callback])
app.listen(8000, () => {
  console.log("server listening on 8000...");
});

// route
// Syntax : app.[method](route, handler)
```

<br/>

- [Express] app.listen 과 http.createServer(app) 의 차이

```javascript
/* express 모듈로 listen 으로 등록하기 */

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

- DB 설정
  - routes
  - Syntax : app.[method](route, handler)

```javascript
// src/routes/messages.js

import { v4 } from "uuid";
import { readDB, writeDB } from "../dbController.js";

// DB 설정
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
        if (targetIndex < 0) throw "메시지가 없습니다.";
        if (msgs[targetIndex].userId !== body.userId)
          throw "사용자가 다릅니다.";

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
        if (targetIndex < 0) throw "메시지가 없습니다.";
        if (msgs[targetIndex].userId !== body.userId)
          throw "사용자가 다릅니다.";

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
