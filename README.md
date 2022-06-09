### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(ch1)

---

```jsx
# npm install
yarn install 또는 yarn

# npm i <package> --save
yarn add <package>

# npm i <package> --save-dev
yarn add <package> --dev : --dev 옵션은 -D 와 같다.

# 패키지 삭제
yarn remove <package>

# dependencies와 devDependencies 모두 (package.json 에 명시된) version rule 에 따라 최신 버전으로 업그레이드.
# 만약 어떤 패키지가 semantic versioning([segVer](https://github.com/semver/semver/blob/master/semver.md))를
# 따르지 않는다면, version rule이 무색해져 하위 호환성이 보장되지 않는 업그레이드일 수도 있다.
yarn upgrade

# 특정 패키지를 특정 버전으로 업그레이드
yarn upgrade <package>@<version>

# 목록들 중에서 원하는 패키지만 최신버전으로 업그레이드하는 interactive terminal ui 를 제공한다.
yarn upgrade-interactive

# production 환경서 필요한 dependencies 만 설치
NODE_ENV=production yarn install 또는 yarn install --production
```

---

<br />

### 🛠 1. Client - 기본기능 구현

- 클라이언트 환경 세팅
- 목록뷰 구현
- 스타일
- 메시지 추가하기
- 메시지 수정 & 삭제하기

<br />

### 🔨 2. 실행방법

- yarn init -y : package.json 자동 생성

```jsx
// ch1/package.json

{
  "name": "api-practice",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/roy-jung/api-practice.git",
  "author": "roy-jung <power4ce@gmail.com>",
  "license": "MIT",
  "private": true, // 워크스페이스 이용 가능
  "workspaces": [
    "client",
    "server"
  ],
  "scripts": {
    "client": "yarn workspace client start",
    "server": "yarn workspace server start"
  }
}
```

- cd client
- yarn init -y : package.json 자동 생성

```jsx
// ch1/client

yarn add react react-dom next sass axios

yarn add --dev webpack
```

- cd ..(root folder)

```jsx
// ch1

yarn run client
```

---

- CRUD

```jsx
const [msgs, setMsgs] = useState(originalMsgs);
const [editingId, setEditingId] = useState(null);

// create
// Date.now(): 현재 타임스탬프를 반환하는 메서드
const onCreate = (text) => {
  const newMsg = {
    id: msgs.length + 1,
    userId: getRandomUserId(),
    timestamp: Date.now(),
    text: `${msgs.length + 1} ${text}`,
  };
  setMsgs((msgs) => [newMsg, ...msgs]);
};

// update
// splice() 메서드는 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경
const onUpdate = (text, id) => {
  setMsgs((msgs) => {
    const targetIndex = msgs.findIndex((msg) => msg.id === id);
    // findIndex() => 만족하는 요소가 없으면 -1을 반환
    if (targetIndex < 0) return msgs;
    const newMsgs = [...msgs];
    newMsgs.splice(targetIndex, 1, {
      ...msgs[targetIndex],
      text,
    });
    return newMsgs;
  });
  doneEdit();
};

// delete
// splice() 메서드는 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경
const onDelete = (id) => {
  setMsgs((msgs) => {
    const targetIndex = msgs.findIndex((msg) => msg.id === id);
    if (targetIndex < 0) return msgs;
    const newMsgs = [...msgs];
    newMsgs.splice(targetIndex, 1);
    return newMsgs;
  });
};

const doneEdit = () => setEditingId(null);

return (
  <>
    <MsgInput mutate={onCreate} />
    <ul className="messages">
      {msgs.map((x) => (
        <MsgItem
          key={x.id}
          {...x}
          onUpdate={onUpdate}
          onDelete={() => onDelete(x.id)}
          startEdit={() => setEditingId(x.id)}
          isEditing={editingId === x.id}
        />
      ))}
    </ul>
  </>
);
```

---

### [Javascript 내장함수를 이용한 숫자/날짜의 현지화](https://blog.munilive.com/posts/javascript-localization-with-toLocaleString.html)

<br/>

- Number.prototype.toLocaleSting()
  - 지정된 지역에서 사용하는 숫자의 표현방식으로 문자열로 리턴한다.
  - Syntax : NumberObject.toLocaleString([locales [, options]])
- Example

```jsx
function toNumberFormatOfKor(num) {
  return num.toLocaleString("ko-KR");
}

console.log(toNumberFormatOfKor(123456.789)); // 123,456.789
console.log(toNumberFormatOfKor(NaN)); // NaN
```

<br/>

- #### [new Date() - 시간과 날짜 표현](https://devjhs.tistory.com/80)

```jsx
new Date(timestamp).toLocaleString("ko-KR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true, // 오전, 오후
});
```

- Date.prototype.toLocaleString()
  - 지정된 지역에서 표현하는 방식의 날짜를 문자열로 리턴한다.
  - Syntax : DateObject.toLocaleString([locales [, options]])
- Example

```jsx
function toDateFormatOfKor(date) {
  return date.toLocaleString("ko-KR");
}

function toDateFormatOfUS(date) {
  return date.toLocaleString("en-US", { timeZone: "America/New_York" });
}

const date = new Date("2021-04-23T09:30:00+09:00");
console.log(toDateFormatOfKor(date)); // 2021. 4. 23. 오전 9:30:00
console.log(toDateFormatOfUS(date)); // 4/22/2021, 8:30:00 PM
```

---

### [React로 양식(form) UI 구현하기](https://www.daleseo.com/react-forms/)

- Form
  - Form태그 하나당 꼭 한 개 이상의 submit 버튼이 존재해야 함
  - 제출 버튼을 클릭하면 양식(form)에서 제출(submit) 이벤트가 발생함
  - 이 이벤트를 처리하기 위한 handleSubmit() 함수를 작성하고, 양식(`<form/>`)의 onSubmit 속성에 설정해줌

```jsx
<form className="messages__input" onSubmit={onSubmit}>
  <textarea
    ref={textRef}
    defaultValue={text}
    placeholder="내용을 입력하세요."
  />
  <button type="submit">완료</button>
</form>
```

---

### [next.js getInitialProps 사용법](https://kyounghwan01.github.io/blog/React/next/mui/#document-tsx)

- 서버사이드 렌더링을 하는 nextJs에서 컴포넌트는 각 페이지마다 사전에 불러와야할 데이터가 있습니다.(이하 data fetching) react, vue같은 Client Side Rendering (CSR)의 경우는 useEffect, created 함수를 이용하여 data fetching을 합니다. **서버사이드에서 실행하는 next에서는 getInitialProps를 이용하여 data fetching 작업을 합니다.**

- next v9 이상에서는 getInitialProps 대신 getStaticProps, getStaticPaths, getServerSideProps을 사용하도록 가이드 합니다.

- getInitialProps 이점
  - 1. 속도가 빨라집니다. 서버는 data fetching만, 브라우저는 렌더링만 함으로 연산을 브라우저와 서버가 각각 나누어 분담하게되어 그만큼 속도가 빨라집니다.
  - 2. 함수형 컴포넌트로 next를 코딩할 경우, 렌더링 하는 함수와 data fetching을 하는 함수가 분리됨으로 개발자의 입장에서 로직 파악이 쉽습니다. (예시 코드를 보면서 자세히 설명하겠습니다.)

```jsx
import "./index.scss";

// NextJS에서 서버사이드 렌더링을 하기위한 컴포넌트
const App = ({ Component, pageProps }) => <Component {...pageProps} />;

// getInitialProps: data fetching 작업
App.getInitialProps = async ({ ctx, Component }) => {
  // 하위 컴포넌트에 getInitialProps가 있다면 추가 (각 개별 컴포넌트에서 사용할 값 추가)
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default App;
```

<br/>

- Context Object
  - pathname - 현재 pathname (`/user?type=normal`-> `/user`)
  - queyr - 현재 query를 객체로 (`http://localhost:3000/blog/test` -> `{id: 'test'}`, `/post?type=secret` -> `{type: 'secret'}`)
  - asPath - 전체 path (`http://localhost:3000/blog/test` -> `/blog/[id]`, `/blog/test`)
  - req - HTTP request object (server only)
  - res - HTTP response object (server only)
  - err - Error object if any error is encountered during the rendering

<br/>
<br/>

---

---

<br/>
<br/>

### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(ch2)

---

<br />

### 🛠 1. Server - 기본기능 구현

- express 서버 및 json database 만들기
- routes 정의

<br />

### 🔨 2. 실행방법

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

<br/>
<br/>

---

---

<br/>
<br/>

### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(ch3)

---

<br />

### 🛠 1. Client - 기본기능 구현

- 클라이언트에서 REST API로 데이터 통신하기
- 무한스크롤 구현하기
- 서버사이드 렌더링

<br />

<br/>

---

<br/>

- fetcher.js

```jsx
// fetcher.js

import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

// ...rest : post, put 메소드의 data 유무
const fetcher = async (method, url, ...rest) => {
  const res = await axios[method](url, ...rest);
  return res.data;
};

export default fetcher;

/*
get: axios.get( url[,config] )
delete: axios.delete( url[,config] )
post: axios.post( url, data[,config] )
put: axios.put( url, data[,config] )
*/
```

<br/>

---

<br/>

- REST API로 데이터 통신 : delete
  - Syntax : delete: axios.delete( url[,config] )
  - client
    - params로 데이터를 보내주지만, 실제로는 Query_string으로 보내지게 됨
  - server
    - params가 아닌 query로 받을 수 있음

```jsx
// client/components/MsgList

const onDelete = async (id) => {
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      // params로 데이터를 보내주지만, 실제로는 Query_string으로 보내지게 됨
      // `/messages/${id}/?userId=${userId}`와 같은 형태
      params: { userId },
    });
    setMsgs((msgs) => {
      // receivedId + "" => type을 String으로 변환
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId + "");
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

// server/src/routes/messages

 {
    // DELETE MESSAGE
    // delete: axios.delete( url[,config] )
    // delete메소드는 data 객체가 없어, userId를 넘겨주는 객체가 config라는 객체안에 들어가게 됨
    // params가 아닌 query로 받을 수 있음
    method: "delete",
    route: "/messages/:id",
    handler: ({ params: { id }, query: { userId } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw "메시지가 없습니다.";
        if (msgs[targetIndex].userId !== userId) throw "사용자가 다릅니다.";

        msgs.splice(targetIndex, 1);
        setMsgs(msgs);
        res.send(id);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
```

<br/>

---

<br/>

- 무한스크롤 구현하기

1. 무한스크롤 : client

```jsx
// client/components/MsgList.js

import { useState, useEffect, useRef } from "react";

...

import useInfiniteScroll from "../hooks/useInfiniteScroll";

...

  // 마지막 데이터일시 무한스크롤 중단
  const [hasNext, setHasNext] = useState(true);

  // 무한스크롤 Ref
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

...

  // useEffect 훅 내부에서는 async, await를 직접 호출하지 않게끔 하고 있어서
  // getMessages 함수를 별도로 생성
  const getMessages = async () => {
    const newMsgs = await fetcher("get", "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
    });

    // 마지막 데이터일시 무한스크롤 중단
    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }

    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

...

  <div ref={fetchMoreEl} />

...

```

- 🔫 trouble shooting
  1. 문제 : 무한스크롤 구현시 `<div ref={fetchMoreEl} />` 이부분이 화면스크롤시 제대로 감지가 안됨
  2. 해결 : OS 및 브라우저 환경에 따라 높이값이 없는 element에 대해서는 intersecting을 제대로 감지하지 못하는 상황이 발생 =>
     - `height: "1px"' `
     - `margin-bottom: "1px"`
     - `padding-bottom: "1px"`
     - `border: "1px solid transparent"`  
       의 높이값을 주어 해결!

<br/>

2. 무한스크롤 hook : useInfiniteScroll

```jsx
// client/hooks/useInfiniteScroll.js

import { useRef, useState, useEffect, useCallback } from "react";

const useInfiniteScroll = (targetEl) => {
  // 최초로 한번 데이터 불러오기 방지 => useRef(null)
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  // some(): callback이 어떤 배열 요소가 하나라도 배열 내 존재하는 경우 true를 반환, 그 외엔 false.
  // entries[0]( entries의 첫번째 인자 ) 대신 일반적으로 사용하기 위해 entries.some( ... ) 을 사용
  // 새로고침 할때마다 데이터 불러오기 방지 => useCallback( ... , [])
  const getObserver = useCallback(() => {
    // 관찰자 초기화
    if (!observerRef.current) {
      // new IntersectionObserver(): 관찰할 대상(Target)이 등록되거나 가시성(Visibility, 보이는지 보이지 않는지)에 변화가 생기면 관찰자는 콜백(Callback)을 실행
      // isIntersecting: 관찰 대상이 루트 요소와 교차 상태로 들어가거나(true) 교차 상태에서 나가는지(false) 여부를 나타내는 값(Boolean)
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(entries.some((entry) => entry.isIntersecting))
      );
    }
    return observerRef.current;
  }, [observerRef.current]);

  // 관찰할 대상(요소) 등록
  useEffect(() => {
    // 관찰할 대상(요소) 관찰
    if (targetEl.current) getObserver().observe(targetEl.current);

    // 관찰할 대상(요소) 관찰 중지
    return () => {
      getObserver().disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
```

<br/>

3. 무한스크롤 : server

```javascript
// server/src/routes/messages.js

...

  {
    // GET MESSAGES
    method: "get",
    route: "/messages",
    handler: ({ query: { cursor = "" } }, res) => {
      const msgs = getMsgs();
      // findIndex() : 만족하는 요소가 없으면 -1을 반환
      const fromIndex = msgs.findIndex((msg) => msg.id === cursor) + 1;
      res.send(msgs.slice(fromIndex, fromIndex + 15));
    },
  },

...

```

<br/>
<br/>

---

---

<br/>
<br/>

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
