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
  - query - 현재 query를 객체로 (`http://localhost:3000/blog/test` -> `{id: 'test'}`, `/post?type=secret` -> `{type: 'secret'}`)
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

  <div ref={fetchMoreEl} style={{ paddingBottom: "1px" }}/>

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
  // 최초의 한번 데이터 불러오고, 이후에는 재사용을 위해 useRef(null) 사용
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

<br/>
<br/>

---

---

<br/>
<br/>

### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(ch5)

<br/>

---

<br/>

### 🛠 . Client - GraphQL 통신(ch5)

- GraphQL 환경세팅
- 클라이언트에서 GraphQL로 데이터 통신하기

<br/>

---

<br/>

- cd ch5
- cd client

```jsx
// ch5/client

yarn add graphql graphql-request graphql-tag react-query

// graphql-request : graphql API 호출 라이브러리
// graphql-tag : graphql 언어를 javascript 언어로 치환해 주는 라이브러리
// react-query : graphql 관리 라이브러리
```

<br/>

---

<br/>

- [react-query](https://velog.io/@kimhyo_0218/React-Query-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%BF%BC%EB%A6%AC-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-useQuery) 초기화 작업 : \_app.js에서 작업

  1. 리액트에서 비동기 로직을 리액트스럽게 다룰 수 있게 해주는 라이브러리
  2. server state를 아주 효율적으로 관리
  3. isLoading, isError, refetch, Data Caching 등 기능을 제공

<br/>

- React Query 기본 셋팅

```jsx
// React Query 기본 셋팅

// QueryClientProvider
//     - 리액트 쿼리 사용을 위해 QueryClientProvider 를 최상단에서 감싸주어야한다.
//     - 쿼리 인스턴스를 생성 후 client={queryClient} 작성해준다.
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}

// useQuery
import { useQuery } from "react-query";
// 주로 사용되는 3가지 return 값 외에도 더 많은 return 값들이 있다.
const { data, isLoading, error } = useQuery(queryKey, queryFn, options);
```

<br/>

- \_app.js에서 React Query 초기화 작업

```jsx
// _app.js에서 React Query 초기화(사용 가능한 상태) 작업
import { useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import "./index.scss";

// refetchOnWindowFocus 는 데이터가 stale 상태일 경우 윈도우 포커싱 될 때 마다 refetch를 실행하는 옵션
// 예를 들어, 크롬에서 다른 탭을 눌렀다가 다시 원래 보던 중인 탭을 눌렀을 때도 이 경우에 해당
const App = ({ Component, pageProps }) => {
  // 최초의 한번만 작성을 하고, 이후에는 재사용을 위해 useRef(null) 사용
  const clientRef = useRef(null);
  const getClient = () => {
    if (!clientRef.current)
      clientRef.current = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      });
    return clientRef.current;
  };

  // Hydrate는 Server Side 단에서 렌더링 된 정적 페이지와 번들링된 JS파일을 클라이언트에게 보낸 뒤,
  // 클라이언트 단에서 HTML 코드와 React인 JS코드를 서로 매칭 시키는 과정

  // React Query는 Hydration을 통해 SSR을 구현 및 fetching Data를 client cach에 저장
  return (
    <QueryClientProvider client={getClient()}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
};

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default App;
```

<br/>

---

<br/>

- fetcher.js => queryClient.js 변환

```jsx
// client/queryClient.js
import { request } from "graphql-request";

const URL = "http://localhost:8000/graphql";

export const fetcher = (query, variables = {}) =>
  request(URL, query, variables);

export const QueryKeys = {
  MESSAGES: "MESSAGES",
  MESSAGE: "MESSAGE",
  USERS: "USERS",
  USER: "USER",
};
```

<br/>

---

<br/>

- index.js의 getServerSideProps 변경

```jsx
// client/pages/index.js
import MsgList from "../components/MsgList";
import { fetcher } from "../queryClient";
import { GET_MESSAGES } from "../graphql/message";
import { GET_USERS } from "../graphql/user";

const Home = ({ smsgs, users }) => (
  <>
    <h1>SIMPLE SNS</h1>
    <MsgList smsgs={smsgs} users={users} />
  </>
);

export const getServerSideProps = async () => {
  const { messages: smsgs } = await fetcher(GET_MESSAGES);
  const { users } = await fetcher(GET_USERS);

  return {
    props: { smsgs, users },
  };
};

export default Home;
```

<br/>

---

<br/>

- graphql 작성

```jsx
// client/graphql/message.js
import gql from "graphql-tag";

export const GET_MESSAGES = gql`
  query GET_MESSAGES {
    messages {
      id
      text
      userId
      timestamp
    }
  }
`;

export const GET_MESSAGE = gql`
  query GET_MESSAGE($id: ID!) {
    message(id: $id) {
      id
      text
      userId
      timestamp
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CREATE_MESSAGE($text: String!, $userId: ID!) {
    createMessage(text: $text, userId: $userId) {
      id
      text
      userId
      timestamp
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation UPDATE_MESSAGE($id: ID!, $text: String!, $userId: ID!) {
    updateMessage(id: $id, text: $text, userId: $userId) {
      id
      text
      userId
      timestamp
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DELETE_MESSAGE($id: ID!, $userId: ID!) {
    deleteMessage(id: $id, userId: $userId)
  }
`;
```

<br/>

---

<br/>

- React Query의 [useQuery](https://jforj.tistory.com/243?category=877028) 사용 => `const res = useQuery(queryKey, queryFn);`

  1. React Query를 이용해 서버로부터 데이터를 조회해올 때 사용합니다.

  2. 데이터 조회가 아닌 데이터 변경 작업을 할 때는 useMutation을 사용합니다.

     - invalidateQueries

       - 서버로부터 다시 데이터를 조회해오기 위함
       - 데이터를 저장할 때 invalidateQueries를 이용해 useQuery가 가지고 있던 queryKey의 유효성을 제거해주면 캐싱되어있는 데이터를 화면에 보여주지 않고 서버에 새롭게 데이터를 요청
       - `queryClient.invalidateQueries('QueryKeys.MESSAGES'); // queryKey 유효성 제거`

     - setQueryData

       - 기존에 queryKey에 매핑되어 있는 데이터를 새롭게 정의
       - 서버에 다시 데이터를 요청하지 않고도 사용자 화면에 변경된 데이터를 함께 보여줄 수 있음

  3. queryKey : useQuery마다 부여되는 고유 Key 값(문자열, 배열)

     - 💡 queryKey 역할 : React Query가 query 캐싱을 관리할 수 있도록 도와줌

  4. queryFn : promise 처리가 이루어지는 함수

```jsx
// client/components/MsgList.js
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQueryClient, useMutation, useQuery } from "react-query";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { QueryKeys, fetcher } from "../queryClient";
import {
  GET_MESSAGES,
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
} from "../graphql/message";
// import useInfiniteScroll from '../hooks/useInfiniteScroll'

const MsgList = ({ smsgs, users }) => {
  // graphql이 useQueryClient가 가지고 있는 캐시정보에 { mutate: ... }의 정보들을 업데이트 해주는 형식
  const client = useQueryClient();

  const { query } = useRouter();
  const userId = query.userId || query.userid || "";

  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);

  /* const [hasNext, setHasNext] = useState(true)
  const fetchMoreEl = useRef(null)
  const intersecting = useInfiniteScroll(fetchMoreEl) */

  const { mutate: onCreate } = useMutation(
    ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        // ✅ QueryKeys 지정 후, messages 상제 정보(데이터) 업데이트
        // 기존 데이터 : old, 업데이트 데이터 : createMessage
        // mutation에서 return된 값을 이용해서 get 함수의 파라미터를 변경해야할 경우 setQueryData를 사용
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          return {
            messages: [createMessage, ...old.messages],
          };
        });
      },
    }
  );

  const { mutate: onUpdate } = useMutation(
    ({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        // ✅ QueryKeys 지정 후, messages 상제 정보(데이터) 업데이트
        // 기존 데이터 : old, 업데이트 데이터 : updateMessage
        // mutation에서 return된 값을 이용해서 get 함수의 파라미터를 변경해야할 경우 setQueryData를 사용
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const targetIndex = old.messages.findIndex(
            (msg) => msg.id === updateMessage.id
          );
          if (targetIndex < 0) return old;
          const newMsgs = [...old.messages];
          newMsgs.splice(targetIndex, 1, updateMessage);
          return { messages: newMsgs };
        });
        doneEdit();
      },
    }
  );

  const { mutate: onDelete } = useMutation(
    (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      onSuccess: ({ deleteMessage: deletedId }) => {
        // ✅ QueryKeys 지정 후, messages 상제 정보(데이터) 업데이트
        // 기존 데이터 : old, 업데이트 데이터 : deleteMessage: deletedId
        // mutation에서 return된 값을 이용해서 get 함수의 파라미터를 변경해야할 경우 setQueryData를 사용
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const targetIndex = old.messages.findIndex(
            (msg) => msg.id === deletedId
          );
          if (targetIndex < 0) return old;
          const newMsgs = [...old.messages];
          newMsgs.splice(targetIndex, 1);
          return { messages: newMsgs };
        });
      },
    }
  );

  const doneEdit = () => setEditingId(null);

  // useQuery
  // const { data, isLoading, error } = useQuery(queryKey, queryFn, options);
  const { data, error, isError } = useQuery(QueryKeys.MESSAGES, () =>
    fetcher(GET_MESSAGES)
  );

  useEffect(() => {
    if (!data?.messages) return;
    console.log("msgs changed");
    setMsgs(data.messages);
  }, [data?.messages]);

  if (isError) {
    console.error(error);
    return null;
  }

  /* useEffect(() => {
    if (intersecting && hasNext) getMessages()
  }, [intersecting]) */

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            myId={userId}
            user={users.find((x) => userId === x.id)}
          />
        ))}
      </ul>
      {/* <div ref={fetchMoreEl} /> */}
    </>
  );
};

export default MsgList;
```

<br/>

- 💡 Query들은 4개의 상태를 가지며, useQuery가 반환하는 객체의 프로퍼티로 어떤 상태인지 확인이 가능하다.

  - fresh : 새롭게 추가된 쿼리 인스턴스 → active 상태의 시작, 기본 staleTime이 0이기 때문에 아무것도 설정을 안해주면 호출이 끝나고 바로 stale 상태로 변한다. staleTime을 늘려줄 경우 fresh한 상태가 유지되는데, 이때는 쿼리가 다시 마운트되도 패칭이 발생하지 않고 기존의 fresh한 값을 반환한다.
  - fetching : 요청을 수행하는 중인 쿼리
  - stale : 인스턴스가 존재하지만 이미 패칭이 완료된 쿼리. 특정 쿼리가 stale된 상태에서 같은 쿼리 마운트를 시도한다면 캐싱된 데이터를 반환하면서 리패칭을 시도한다.
  - inactive : active 인스턴스가 하나도 없는 쿼리. inactive된 이후에도 cacheTime 동안 캐시된 데이터가 유지된다. cacheTime이 지나면 GC된다.

<br/>

- 💡 unique key : 한 번 fresh가 되었다면 계속 추적이 가능하다. 리패칭, 캐싱, 공유 등을 할때 참조되는 값. 주로 배열을 사용하고, 배열의 요소로 쿼리의 이름을 나타내는 문자열과 프로미스를 리턴하는 함수의 인자로 쓰이는 값을 넣는다.

<br/>

- 💡 Caching Process
  - useQuery의 첫번째, 새로운 인스턴스 마운트 ⇒ 만약에 런타임간 최초로 fresh한 해당 쿼리가 호출되었다면, 캐싱하고, 패칭이 끝나면 해당 쿼리를 stale로 바꿈(staleTime:0)
  - 앱 어딘가에서 useQuery 두번째 인스턴스 마운트 ⇒ 이미 쿼리가 stale이므로 접때 요청때 만들어 놨었던 캐시를 반환하고 리패칭을 함. 이때 캐시도 업데이트.
  - 쿼리가 언마운트되거나 더이상 사용하지 않을 때 ⇒ 마지막 인스턴스가 언마운트되어 inactive 상태가 되었을때 5분(cacheTime의 기본값)이 지나면 자동으로 삭제한다.

<br/>

[React Query 더 알아보기\_1](https://kyounghwan01.github.io/blog/React/react-query/basic/#api)<br/>
[React Query 더 알아보기\_2](https://maxkim-j.github.io/posts/react-query-preview)<br/>
[React Query 더 알아보기\_3](https://fe-developers.kakaoent.com/2022/220224-data-fetching-libs/)<br/>
[React Query 더 알아보기\_4](https://jforj.tistory.com/243?category=877028)<br/>

<br/>
<br/>

---

---

<br/>
<br/>

### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(ch6)

<br/>

---

<br/>

### 🛠 . Client - GraphQL 무한스크롤(ch6)

- useInfiniteQuery 적용하기
- 무한스크롤 환경에서 mutation 처리 및 기능 보완

<br/>

---

<br/>

- GraphQL server 설정

```javascript
// ch6/server/src/schema/message.js

import { gql } from 'apollo-server-express'

//cursor: ID) 추가
const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    userId: ID!
    user: User!
    timestamp: Float #13자리 숫자
  }

  extend type Query {
    messages(cursor: ID): [Message!]! # getMessages
    message(id: ID!): Message! # getMessage
  }

  ...

`

export default messageSchema


// ch6/server/src/resolvers/message.js

import { v4 } from "uuid";
import { writeDB } from "../dbController.js";

const setMsgs = (data) => writeDB("messages", data);

/*
parent: parent 객체. 거의 사용X
args: Query에 필요한 필드에 제공되는 인수(parameter)
context: 로그인한 사용자. DB Access 등의 중요한 정보들
*/

const messageResolver = {
  Query: {
    messages: (parent, { cursor = "" }, { db }) => {
      const fromIndex = db.messages.findIndex((msg) => msg.id === cursor) + 1;
      return db.messages?.slice(fromIndex, fromIndex + 15) || [];
    },

  ...

  }
}
```

<br/>

---

<br/>

- getServerSideProps 직렬구조 => 병렬구조 변환
  - 데이터를 동시에 응답 받기 위해 병렬구조로 변환

```jsx
// ch6/client/pages/index.js

import MsgList from "../components/MsgList";
import { fetcher } from "../queryClient";
import { GET_MESSAGES, GET_USERS } from "../graphql/message";

const Home = ({ smsgs }) => (
  <>
    <h1>SIMPLE SNS</h1>
    <MsgList smsgs={smsgs} />
  </>
);

export const getServerSideProps = async () => {
  const [{ messages: smsgs }, { users }] = await Promise.all([
    fetcher(GET_MESSAGES),
    fetcher(GET_USERS),
  ]);
  return {
    props: { smsgs, users },
  };
};

export default Home;
```

<br/>

---

<br/>

- client/graphql 수정

```jsx
// ch6/client/graphql/message.js

import gql from 'graphql-tag'

// ($cursor: ID) 추가
export const GET_MESSAGES = gql`
  query GET_MESSAGES($cursor: ID) {
    messages(cursor: $cursor) {
      id
      text
      timestamp
      user {
        id
        nickname
      }
    }
  }
`

...

```

<br/>

---

<br/>

- [useInfiniteQuery](https://jforj.tistory.com/246) : `const res = useInfiniteQuery(queryKey, queryFn);`

  1. useQuery와 다른 구조인 pageParams와 pages 를 받고, API를 호출한 결과를 pages 배열 안에 갖고 있음

  2. pageParam : useInfiniteQuery가 현재 어떤 페이지에 있는지를 확인할 수 있는 파라미터 값, pageParams 다음과 같이 queryFn의 파라미터 값에서 확인할 수 있음

  3. getNextPageParam : 다음 페이지에 있는 데이터를 조회해올 때 사용

     - 다음 api를 요청할 때 사용될 pageParam값을 정할 수 있음
     - return 되는 값이 다음 페이지가 호출될 때 pageParam 값으로 사용

  4. hasNextPage: cursor(현재 위치)가 끝에 있는지 알려주는 함수(만약 다음 페이지에 있을 때, true)

  5. fetchNextPage: 다음 페이지의 데이터를 호출할 때 사용

     - useInfiniteQuery의 return 값에 포함되며 다음과 같이 버튼을 클릭할 때 실행될 이벤트로 등록해줄 수 있음

  6. 💡 hasNextPage는 Boolean 값을 반환, hasNextPage의 값이 true일 때 fetchNextPage 함수를 실행시켜주면 infiniteQuery를 구현할 수 있음

```jsx
// ch6/client/queryClient.js

import { request } from "graphql-request";
const URL = "http://localhost:8000/graphql";

export const fetcher = (query, variables = {}) =>
  request(URL, query, variables);

export const QueryKeys = {
  MESSAGES: "MESSAGES",
  MESSAGE: "MESSAGE",
  USERS: "USERS",
  USER: "USER",
};

export const findTargetMsgIndex = (pages, id) => {
  let msgIndex = -1;
  const pageIndex = pages.findIndex(({ messages }) => {
    msgIndex = messages.findIndex((msg) => msg.id === id);
    if (msgIndex > -1) {
      return true;
    }
    return false;
  });
  return { pageIndex, msgIndex };
};

export const getNewMessages = (old) => ({
  pageParams: old.pageParams,
  pages: old.pages.map(({ messages }) => ({ messages: [...messages] })),
});

// ch6/client/components/MsgList.js

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useQueryClient, useMutation, useInfiniteQuery } from "react-query";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import {
  QueryKeys,
  fetcher,
  findTargetMsgIndex,
  getNewMessages,
} from "../queryClient";
import {
  GET_MESSAGES,
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
} from "../graphql/message";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const MsgList = ({ smsgs }) => {
  const client = useQueryClient();

  const { query } = useRouter();
  const userId = query.userId || query.userid || "";

  // const [msgs, setMsgs] = useState({ messages: smsgs }); / flatMap() 사용시
  const [msgs, setMsgs] = useState([{ messages: smsgs }]);
  const [editingId, setEditingId] = useState(null);

  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const doneEdit = () => setEditingId(null);

  // setQueryData
  //   - 기존에 queryKey에 매핑되어 있는 데이터를 새롭게 정의
  //   - 서버에 다시 데이터를 요청하지 않고도 사용자 화면에 변경된 데이터를 함께 보여줄 수 있음
  const { mutate: onCreate } = useMutation(
    ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          // pages: [{ messages: [createMessage, 15] }, { messages: [15] }, { messages: [10] }]
          return {
            pageParam: old.pageParam,
            pages: [
              { messages: [createMessage, ...old.pages[0].messages] },
              ...old.pages.slice(1),
            ],
          };
        });
      },
    }
  );

  const { mutate: onUpdate } = useMutation(
    ({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          // pages: [{ messages: [15] }, { messages: [1,2,3, ... **7**, 8, ...15] }, { messages: [10] }]
          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            updateMessage.id
          );
          if (pageIndex < 0 || msgIndex < 0) return old;
          const newMsgs = getNewMessages(old);
          newMsgs.pages[pageIndex].messages.splice(msgIndex, 1, updateMessage);
          return newMsgs;
        });
        doneEdit();
      },
    }
  );

  const { mutate: onDelete } = useMutation(
    (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      onSuccess: ({ deleteMessage: deletedId }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          // pages: [{ messages: [deleteMessage, 14] }, { messages: [deleteMessage, 14] }, { messages: [10] }]
          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            deletedId
          );
          if (pageIndex < 0 || msgIndex < 0) return old;

          const newMsgs = getNewMessages(old);
          newMsgs.pages[pageIndex].messages.splice(msgIndex, 1);
          return newMsgs;
        });
      },
    }
  );

  // - fetchNextPage: 다음 페이지의 데이터를 호출할 때 사용
  // - hasNextPage: cursor(현재 위치)가 끝에 있는지 알려주는 함수(만약 다음 페이지에 있을 때, true)
  // - getNextPageParam : 다음 페이지에 있는 데이터를 조회해올 때 사용
  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    QueryKeys.MESSAGES,
    ({ pageParam = "" }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: ({ messages }) => {
        return messages?.[messages.length - 1]?.id; // 다음 페이지를 호출할 때 사용 될 pageParam
      },
    }
  );

  useEffect(() => {
    if (!data?.pages) return;
    // const data.pages = [ {messages: [...]}, {messages: [...]} ] -> [...] / 단일한 배열로 병합 : flatMap()
    // mergeMsgs = data.pages.flatMap(d => d.messages)
    // setMsgs({mergeMsgs});
    setMsgs(data.pages);
  }, [data?.pages]);

  if (isError) {
    console.error(error);
    return null;
  }

  useEffect(() => {
    if (intersecting && hasNextPage) fetchNextPage();
  }, [intersecting, hasNextPage]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {/* msgs.map( x => (...)) / flatMap() 사용시 */}
        {msgs.map(({ messages }, pageIndex) =>
          messages.map((x) => (
            <MsgItem
              key={pageIndex + x.id}
              {...x}
              onUpdate={onUpdate}
              onDelete={() => onDelete(x.id)}
              startEdit={() => setEditingId(x.id)}
              isEditing={editingId === x.id}
              myId={userId}
            />
          ))
        )}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
```
