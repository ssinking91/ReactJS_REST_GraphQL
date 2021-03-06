### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(ch1)

---

```jsx
# npm install
yarn install ๋๋ yarn

# npm i <package> --save
yarn add <package>

# npm i <package> --save-dev
yarn add <package> --dev : --dev ์ต์์ -D ์ ๊ฐ๋ค.

# ํจํค์ง ์ญ์ 
yarn remove <package>

# dependencies์ devDependencies ๋ชจ๋ (package.json ์ ๋ช์๋) version rule ์ ๋ฐ๋ผ ์ต์  ๋ฒ์ ์ผ๋ก ์๊ทธ๋ ์ด๋.
# ๋ง์ฝ ์ด๋ค ํจํค์ง๊ฐ semantic versioning([segVer](https://github.com/semver/semver/blob/master/semver.md))๋ฅผ
# ๋ฐ๋ฅด์ง ์๋๋ค๋ฉด, version rule์ด ๋ฌด์ํด์ ธ ํ์ ํธํ์ฑ์ด ๋ณด์ฅ๋์ง ์๋ ์๊ทธ๋ ์ด๋์ผ ์๋ ์๋ค.
yarn upgrade

# ํน์  ํจํค์ง๋ฅผ ํน์  ๋ฒ์ ์ผ๋ก ์๊ทธ๋ ์ด๋
yarn upgrade <package>@<version>

# ๋ชฉ๋ก๋ค ์ค์์ ์ํ๋ ํจํค์ง๋ง ์ต์ ๋ฒ์ ์ผ๋ก ์๊ทธ๋ ์ด๋ํ๋ interactive terminal ui ๋ฅผ ์ ๊ณตํ๋ค.
yarn upgrade-interactive

# production ํ๊ฒฝ์ ํ์ํ dependencies ๋ง ์ค์น
NODE_ENV=production yarn install ๋๋ yarn install --production
```

---

<br />

### ๐  1. Client - ๊ธฐ๋ณธ๊ธฐ๋ฅ ๊ตฌํ

- ํด๋ผ์ด์ธํธ ํ๊ฒฝ ์ธํ
- ๋ชฉ๋ก๋ทฐ ๊ตฌํ
- ์คํ์ผ
- ๋ฉ์์ง ์ถ๊ฐํ๊ธฐ
- ๋ฉ์์ง ์์  & ์ญ์ ํ๊ธฐ

<br />

### ๐จย 2. ์คํ๋ฐฉ๋ฒ

- yarn init -y : package.json ์๋ ์์ฑ

```jsx
// ch1/package.json

{
  "name": "api-practice",
  "version": "1.0.0",
  "main": "index.js",
  "repository": "https://github.com/roy-jung/api-practice.git",
  "author": "roy-jung <power4ce@gmail.com>",
  "license": "MIT",
  "private": true, // ์ํฌ์คํ์ด์ค ์ด์ฉ ๊ฐ๋ฅ
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
- yarn init -y : package.json ์๋ ์์ฑ

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
// Date.now(): ํ์ฌ ํ์์คํฌํ๋ฅผ ๋ฐํํ๋ ๋ฉ์๋
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
// splice() ๋ฉ์๋๋ ๋ฐฐ์ด์ ๊ธฐ์กด ์์๋ฅผ ์ญ์  ๋๋ ๊ต์ฒดํ๊ฑฐ๋ ์ ์์๋ฅผ ์ถ๊ฐํ์ฌ ๋ฐฐ์ด์ ๋ด์ฉ์ ๋ณ๊ฒฝ
const onUpdate = (text, id) => {
  setMsgs((msgs) => {
    const targetIndex = msgs.findIndex((msg) => msg.id === id);
    // findIndex() => ๋ง์กฑํ๋ ์์๊ฐ ์์ผ๋ฉด -1์ ๋ฐํ
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
// splice() ๋ฉ์๋๋ ๋ฐฐ์ด์ ๊ธฐ์กด ์์๋ฅผ ์ญ์  ๋๋ ๊ต์ฒดํ๊ฑฐ๋ ์ ์์๋ฅผ ์ถ๊ฐํ์ฌ ๋ฐฐ์ด์ ๋ด์ฉ์ ๋ณ๊ฒฝ
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

### [Javascript ๋ด์ฅํจ์๋ฅผ ์ด์ฉํ ์ซ์/๋ ์ง์ ํ์งํ](https://blog.munilive.com/posts/javascript-localization-with-toLocaleString.html)

<br/>

- Number.prototype.toLocaleSting()
  - ์ง์ ๋ ์ง์ญ์์ ์ฌ์ฉํ๋ ์ซ์์ ํํ๋ฐฉ์์ผ๋ก ๋ฌธ์์ด๋ก ๋ฆฌํดํ๋ค.
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

- #### [new Date() - ์๊ฐ๊ณผ ๋ ์ง ํํ](https://devjhs.tistory.com/80)

```jsx
new Date(timestamp).toLocaleString("ko-KR", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true, // ์ค์ , ์คํ
});
```

- Date.prototype.toLocaleString()
  - ์ง์ ๋ ์ง์ญ์์ ํํํ๋ ๋ฐฉ์์ ๋ ์ง๋ฅผ ๋ฌธ์์ด๋ก ๋ฆฌํดํ๋ค.
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
console.log(toDateFormatOfKor(date)); // 2021. 4. 23. ์ค์  9:30:00
console.log(toDateFormatOfUS(date)); // 4/22/2021, 8:30:00 PM
```

---

### [React๋ก ์์(form) UI ๊ตฌํํ๊ธฐ](https://www.daleseo.com/react-forms/)

- Form
  - Formํ๊ทธ ํ๋๋น ๊ผญ ํ ๊ฐ ์ด์์ submit ๋ฒํผ์ด ์กด์ฌํด์ผ ํจ
  - ์ ์ถ ๋ฒํผ์ ํด๋ฆญํ๋ฉด ์์(form)์์ ์ ์ถ(submit) ์ด๋ฒคํธ๊ฐ ๋ฐ์ํจ
  - ์ด ์ด๋ฒคํธ๋ฅผ ์ฒ๋ฆฌํ๊ธฐ ์ํ handleSubmit() ํจ์๋ฅผ ์์ฑํ๊ณ , ์์(`<form/>`)์ onSubmit ์์ฑ์ ์ค์ ํด์ค

```jsx
<form className="messages__input" onSubmit={onSubmit}>
  <textarea
    ref={textRef}
    defaultValue={text}
    placeholder="๋ด์ฉ์ ์๋ ฅํ์ธ์."
  />
  <button type="submit">์๋ฃ</button>
</form>
```

---

### [next.js getInitialProps ์ฌ์ฉ๋ฒ](https://kyounghwan01.github.io/blog/React/next/mui/#document-tsx)

- ์๋ฒ์ฌ์ด๋ ๋ ๋๋ง์ ํ๋ nextJs์์ ์ปดํฌ๋ํธ๋ ๊ฐ ํ์ด์ง๋ง๋ค ์ฌ์ ์ ๋ถ๋ฌ์์ผํ  ๋ฐ์ดํฐ๊ฐ ์์ต๋๋ค.(์ดํ data fetching) react, vue๊ฐ์ Client Side Rendering (CSR)์ ๊ฒฝ์ฐ๋ useEffect, created ํจ์๋ฅผ ์ด์ฉํ์ฌ data fetching์ ํฉ๋๋ค. **์๋ฒ์ฌ์ด๋์์ ์คํํ๋ next์์๋ getInitialProps๋ฅผ ์ด์ฉํ์ฌ data fetching ์์์ ํฉ๋๋ค.**

- next v9 ์ด์์์๋ getInitialProps ๋์  getStaticProps, getStaticPaths, getServerSideProps์ ์ฌ์ฉํ๋๋ก ๊ฐ์ด๋ ํฉ๋๋ค.

- getInitialProps ์ด์ 
  - 1. ์๋๊ฐ ๋นจ๋ผ์ง๋๋ค. ์๋ฒ๋ data fetching๋ง, ๋ธ๋ผ์ฐ์ ๋ ๋ ๋๋ง๋ง ํจ์ผ๋ก ์ฐ์ฐ์ ๋ธ๋ผ์ฐ์ ์ ์๋ฒ๊ฐ ๊ฐ๊ฐ ๋๋์ด ๋ถ๋ดํ๊ฒ๋์ด ๊ทธ๋งํผ ์๋๊ฐ ๋นจ๋ผ์ง๋๋ค.
  - 2. ํจ์ํ ์ปดํฌ๋ํธ๋ก next๋ฅผ ์ฝ๋ฉํ  ๊ฒฝ์ฐ, ๋ ๋๋ง ํ๋ ํจ์์ data fetching์ ํ๋ ํจ์๊ฐ ๋ถ๋ฆฌ๋จ์ผ๋ก ๊ฐ๋ฐ์์ ์์ฅ์์ ๋ก์ง ํ์์ด ์ฝ์ต๋๋ค. (์์ ์ฝ๋๋ฅผ ๋ณด๋ฉด์ ์์ธํ ์ค๋ชํ๊ฒ ์ต๋๋ค.)

```jsx
import "./index.scss";

// NextJS์์ ์๋ฒ์ฌ์ด๋ ๋ ๋๋ง์ ํ๊ธฐ์ํ ์ปดํฌ๋ํธ
const App = ({ Component, pageProps }) => <Component {...pageProps} />;

// getInitialProps: data fetching ์์
App.getInitialProps = async ({ ctx, Component }) => {
  // ํ์ ์ปดํฌ๋ํธ์ getInitialProps๊ฐ ์๋ค๋ฉด ์ถ๊ฐ (๊ฐ ๊ฐ๋ณ ์ปดํฌ๋ํธ์์ ์ฌ์ฉํ  ๊ฐ ์ถ๊ฐ)
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default App;
```

<br/>

- Context Object
  - pathname - ํ์ฌ pathname (`/user?type=normal`-> `/user`)
  - query - ํ์ฌ query๋ฅผ ๊ฐ์ฒด๋ก (`http://localhost:3000/blog/test` -> `{id: 'test'}`, `/post?type=secret` -> `{type: 'secret'}`)
  - asPath - ์ ์ฒด path (`http://localhost:3000/blog/test` -> `/blog/[id]`, `/blog/test`)
  - req - HTTP request object (server only)
  - res - HTTP response object (server only)
  - err - Error object if any error is encountered during the rendering

<br/>
<br/>

---

---

<br/>
<br/>

### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(ch2)

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

<br/>
<br/>

---

---

<br/>
<br/>

### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(ch3)

---

<br />

### ๐  1. Client - ๊ธฐ๋ณธ๊ธฐ๋ฅ ๊ตฌํ

- ํด๋ผ์ด์ธํธ์์ REST API๋ก ๋ฐ์ดํฐ ํต์ ํ๊ธฐ
- ๋ฌดํ์คํฌ๋กค ๊ตฌํํ๊ธฐ
- ์๋ฒ์ฌ์ด๋ ๋ ๋๋ง

<br />

<br/>

---

<br/>

- fetcher.js

```jsx
// fetcher.js

import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

// ...rest : post, put ๋ฉ์๋์ data ์ ๋ฌด
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

- REST API๋ก ๋ฐ์ดํฐ ํต์  : delete
  - Syntax : delete: axios.delete( url[,config] )
  - client
    - params๋ก ๋ฐ์ดํฐ๋ฅผ ๋ณด๋ด์ฃผ์ง๋ง, ์ค์ ๋ก๋ Query_string์ผ๋ก ๋ณด๋ด์ง๊ฒ ๋จ
  - server
    - params๊ฐ ์๋ query๋ก ๋ฐ์ ์ ์์

```jsx
// client/components/MsgList

const onDelete = async (id) => {
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      // params๋ก ๋ฐ์ดํฐ๋ฅผ ๋ณด๋ด์ฃผ์ง๋ง, ์ค์ ๋ก๋ Query_string์ผ๋ก ๋ณด๋ด์ง๊ฒ ๋จ
      // `/messages/${id}/?userId=${userId}`์ ๊ฐ์ ํํ
      params: { userId },
    });
    setMsgs((msgs) => {
      // receivedId + "" => type์ String์ผ๋ก ๋ณํ
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
    // delete๋ฉ์๋๋ data ๊ฐ์ฒด๊ฐ ์์ด, userId๋ฅผ ๋๊ฒจ์ฃผ๋ ๊ฐ์ฒด๊ฐ config๋ผ๋ ๊ฐ์ฒด์์ ๋ค์ด๊ฐ๊ฒ ๋จ
    // params๊ฐ ์๋ query๋ก ๋ฐ์ ์ ์์
    method: "delete",
    route: "/messages/:id",
    handler: ({ params: { id }, query: { userId } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw "๋ฉ์์ง๊ฐ ์์ต๋๋ค.";
        if (msgs[targetIndex].userId !== userId) throw "์ฌ์ฉ์๊ฐ ๋ค๋ฆ๋๋ค.";

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

- ๋ฌดํ์คํฌ๋กค ๊ตฌํํ๊ธฐ

1. ๋ฌดํ์คํฌ๋กค : client

```jsx
// client/components/MsgList.js

import { useState, useEffect, useRef } from "react";

...

import useInfiniteScroll from "../hooks/useInfiniteScroll";

...

  // ๋ง์ง๋ง ๋ฐ์ดํฐ์ผ์ ๋ฌดํ์คํฌ๋กค ์ค๋จ
  const [hasNext, setHasNext] = useState(true);

  // ๋ฌดํ์คํฌ๋กค Ref
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

...

  // useEffect ํ ๋ด๋ถ์์๋ async, await๋ฅผ ์ง์  ํธ์ถํ์ง ์๊ฒ๋ ํ๊ณ  ์์ด์
  // getMessages ํจ์๋ฅผ ๋ณ๋๋ก ์์ฑ
  const getMessages = async () => {
    const newMsgs = await fetcher("get", "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
    });

    // ๋ง์ง๋ง ๋ฐ์ดํฐ์ผ์ ๋ฌดํ์คํฌ๋กค ์ค๋จ
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

- ๐ซ trouble shooting
  1. ๋ฌธ์  : ๋ฌดํ์คํฌ๋กค ๊ตฌํ์ `<div ref={fetchMoreEl} />` ์ด๋ถ๋ถ์ด ํ๋ฉด์คํฌ๋กค์ ์ ๋๋ก ๊ฐ์ง๊ฐ ์๋จ
  2. ํด๊ฒฐ : OS ๋ฐ ๋ธ๋ผ์ฐ์  ํ๊ฒฝ์ ๋ฐ๋ผ ๋์ด๊ฐ์ด ์๋ element์ ๋ํด์๋ intersecting์ ์ ๋๋ก ๊ฐ์งํ์ง ๋ชปํ๋ ์ํฉ์ด ๋ฐ์ =>
     - `height: "1px"' `
     - `margin-bottom: "1px"`
     - `padding-bottom: "1px"`
     - `border: "1px solid transparent"`  
       ์ ๋์ด๊ฐ์ ์ฃผ์ด ํด๊ฒฐ!

<br/>

2. ๋ฌดํ์คํฌ๋กค hook : useInfiniteScroll

```jsx
// client/hooks/useInfiniteScroll.js

import { useRef, useState, useEffect, useCallback } from "react";

const useInfiniteScroll = (targetEl) => {
  // ์ต์ด์ ํ๋ฒ ๋ฐ์ดํฐ ๋ถ๋ฌ์ค๊ณ , ์ดํ์๋ ์ฌ์ฌ์ฉ์ ์ํด useRef(null) ์ฌ์ฉ
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  // some(): callback์ด ์ด๋ค ๋ฐฐ์ด ์์๊ฐ ํ๋๋ผ๋ ๋ฐฐ์ด ๋ด ์กด์ฌํ๋ ๊ฒฝ์ฐ true๋ฅผ ๋ฐํ, ๊ทธ ์ธ์ false.
  // entries[0]( entries์ ์ฒซ๋ฒ์งธ ์ธ์ ) ๋์  ์ผ๋ฐ์ ์ผ๋ก ์ฌ์ฉํ๊ธฐ ์ํด entries.some( ... ) ์ ์ฌ์ฉ
  // ์๋ก๊ณ ์นจ ํ ๋๋ง๋ค ๋ฐ์ดํฐ ๋ถ๋ฌ์ค๊ธฐ ๋ฐฉ์ง => useCallback( ... , [])
  const getObserver = useCallback(() => {
    // ๊ด์ฐฐ์ ์ด๊ธฐํ
    if (!observerRef.current) {
      // new IntersectionObserver(): ๊ด์ฐฐํ  ๋์(Target)์ด ๋ฑ๋ก๋๊ฑฐ๋ ๊ฐ์์ฑ(Visibility, ๋ณด์ด๋์ง ๋ณด์ด์ง ์๋์ง)์ ๋ณํ๊ฐ ์๊ธฐ๋ฉด ๊ด์ฐฐ์๋ ์ฝ๋ฐฑ(Callback)์ ์คํ
      // isIntersecting: ๊ด์ฐฐ ๋์์ด ๋ฃจํธ ์์์ ๊ต์ฐจ ์ํ๋ก ๋ค์ด๊ฐ๊ฑฐ๋(true) ๊ต์ฐจ ์ํ์์ ๋๊ฐ๋์ง(false) ์ฌ๋ถ๋ฅผ ๋ํ๋ด๋ ๊ฐ(Boolean)
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(entries.some((entry) => entry.isIntersecting))
      );
    }
    return observerRef.current;
  }, [observerRef.current]);

  // ๊ด์ฐฐํ  ๋์(์์) ๋ฑ๋ก
  useEffect(() => {
    // ๊ด์ฐฐํ  ๋์(์์) ๊ด์ฐฐ
    if (targetEl.current) getObserver().observe(targetEl.current);

    // ๊ด์ฐฐํ  ๋์(์์) ๊ด์ฐฐ ์ค์ง
    return () => {
      getObserver().disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
```

<br/>

3. ๋ฌดํ์คํฌ๋กค : server

```javascript
// server/src/routes/messages.js

...

  {
    // GET MESSAGES
    method: "get",
    route: "/messages",
    handler: ({ query: { cursor = "" } }, res) => {
      const msgs = getMsgs();
      // findIndex() : ๋ง์กฑํ๋ ์์๊ฐ ์์ผ๋ฉด -1์ ๋ฐํ
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

<br/>
<br/>

---

---

<br/>
<br/>

### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(ch5)

<br/>

---

<br/>

### ๐  . Client - GraphQL ํต์ (ch5)

- GraphQL ํ๊ฒฝ์ธํ
- ํด๋ผ์ด์ธํธ์์ GraphQL๋ก ๋ฐ์ดํฐ ํต์ ํ๊ธฐ

<br/>

---

<br/>

- cd ch5
- cd client

```jsx
// ch5/client

yarn add graphql graphql-request graphql-tag react-query

// graphql-request : graphql API ํธ์ถ ๋ผ์ด๋ธ๋ฌ๋ฆฌ
// graphql-tag : graphql ์ธ์ด๋ฅผ javascript ์ธ์ด๋ก ์นํํด ์ฃผ๋ ๋ผ์ด๋ธ๋ฌ๋ฆฌ
// react-query : graphql ๊ด๋ฆฌ ๋ผ์ด๋ธ๋ฌ๋ฆฌ
```

<br/>

---

<br/>

- [react-query](https://velog.io/@kimhyo_0218/React-Query-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%BF%BC%EB%A6%AC-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-useQuery) ์ด๊ธฐํ ์์ : \_app.js์์ ์์

  1. ๋ฆฌ์กํธ์์ ๋น๋๊ธฐ ๋ก์ง์ ๋ฆฌ์กํธ์ค๋ฝ๊ฒ ๋ค๋ฃฐ ์ ์๊ฒ ํด์ฃผ๋ ๋ผ์ด๋ธ๋ฌ๋ฆฌ
  2. server state๋ฅผ ์์ฃผ ํจ์จ์ ์ผ๋ก ๊ด๋ฆฌ
  3. isLoading, isError, refetch, Data Caching ๋ฑ ๊ธฐ๋ฅ์ ์ ๊ณต

<br/>

- React Query ๊ธฐ๋ณธ ์ํ

```jsx
// React Query ๊ธฐ๋ณธ ์ํ

// QueryClientProvider
//     - ๋ฆฌ์กํธ ์ฟผ๋ฆฌ ์ฌ์ฉ์ ์ํด QueryClientProvider ๋ฅผ ์ต์๋จ์์ ๊ฐ์ธ์ฃผ์ด์ผํ๋ค.
//     - ์ฟผ๋ฆฌ ์ธ์คํด์ค๋ฅผ ์์ฑ ํ client={queryClient} ์์ฑํด์ค๋ค.
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
// ์ฃผ๋ก ์ฌ์ฉ๋๋ 3๊ฐ์ง return ๊ฐ ์ธ์๋ ๋ ๋ง์ return ๊ฐ๋ค์ด ์๋ค.
const { data, isLoading, error } = useQuery(queryKey, queryFn, options);
```

<br/>

- \_app.js์์ React Query ์ด๊ธฐํ ์์

```jsx
// _app.js์์ React Query ์ด๊ธฐํ(์ฌ์ฉ ๊ฐ๋ฅํ ์ํ) ์์
import { useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import "./index.scss";

// refetchOnWindowFocus ๋ ๋ฐ์ดํฐ๊ฐ stale ์ํ์ผ ๊ฒฝ์ฐ ์๋์ฐ ํฌ์ปค์ฑ ๋  ๋ ๋ง๋ค refetch๋ฅผ ์คํํ๋ ์ต์
// ์๋ฅผ ๋ค์ด, ํฌ๋กฌ์์ ๋ค๋ฅธ ํญ์ ๋๋ ๋ค๊ฐ ๋ค์ ์๋ ๋ณด๋ ์ค์ธ ํญ์ ๋๋ ์ ๋๋ ์ด ๊ฒฝ์ฐ์ ํด๋น
const App = ({ Component, pageProps }) => {
  // ์ต์ด์ ํ๋ฒ๋ง ์์ฑ์ ํ๊ณ , ์ดํ์๋ ์ฌ์ฌ์ฉ์ ์ํด useRef(null) ์ฌ์ฉ
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

  // Hydrate๋ Server Side ๋จ์์ ๋ ๋๋ง ๋ ์ ์  ํ์ด์ง์ ๋ฒ๋ค๋ง๋ JSํ์ผ์ ํด๋ผ์ด์ธํธ์๊ฒ ๋ณด๋ธ ๋ค,
  // ํด๋ผ์ด์ธํธ ๋จ์์ HTML ์ฝ๋์ React์ธ JS์ฝ๋๋ฅผ ์๋ก ๋งค์นญ ์ํค๋ ๊ณผ์ 

  // React Query๋ Hydration์ ํตํด SSR์ ๊ตฌํ ๋ฐ fetching Data๋ฅผ client cach์ ์ ์ฅ
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

- fetcher.js => queryClient.js ๋ณํ

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

- index.js์ getServerSideProps ๋ณ๊ฒฝ

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

- graphql ์์ฑ

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

- React Query์ [useQuery](https://jforj.tistory.com/243?category=877028) ์ฌ์ฉ => `const res = useQuery(queryKey, queryFn);`

  1. React Query๋ฅผ ์ด์ฉํด ์๋ฒ๋ก๋ถํฐ ๋ฐ์ดํฐ๋ฅผ ์กฐํํด์ฌ ๋ ์ฌ์ฉํฉ๋๋ค.

  2. ๋ฐ์ดํฐ ์กฐํ๊ฐ ์๋ ๋ฐ์ดํฐ ๋ณ๊ฒฝ ์์์ ํ  ๋๋ useMutation์ ์ฌ์ฉํฉ๋๋ค.

     - invalidateQueries

       - ์๋ฒ๋ก๋ถํฐ ๋ค์ ๋ฐ์ดํฐ๋ฅผ ์กฐํํด์ค๊ธฐ ์ํจ
       - ๋ฐ์ดํฐ๋ฅผ ์ ์ฅํ  ๋ invalidateQueries๋ฅผ ์ด์ฉํด useQuery๊ฐ ๊ฐ์ง๊ณ  ์๋ queryKey์ ์ ํจ์ฑ์ ์ ๊ฑฐํด์ฃผ๋ฉด ์บ์ฑ๋์ด์๋ ๋ฐ์ดํฐ๋ฅผ ํ๋ฉด์ ๋ณด์ฌ์ฃผ์ง ์๊ณ  ์๋ฒ์ ์๋กญ๊ฒ ๋ฐ์ดํฐ๋ฅผ ์์ฒญ
       - `queryClient.invalidateQueries('QueryKeys.MESSAGES'); // queryKey ์ ํจ์ฑ ์ ๊ฑฐ`

     - setQueryData

       - ๊ธฐ์กด์ queryKey์ ๋งคํ๋์ด ์๋ ๋ฐ์ดํฐ๋ฅผ ์๋กญ๊ฒ ์ ์
       - ์๋ฒ์ ๋ค์ ๋ฐ์ดํฐ๋ฅผ ์์ฒญํ์ง ์๊ณ ๋ ์ฌ์ฉ์ ํ๋ฉด์ ๋ณ๊ฒฝ๋ ๋ฐ์ดํฐ๋ฅผ ํจ๊ป ๋ณด์ฌ์ค ์ ์์

  3. queryKey : useQuery๋ง๋ค ๋ถ์ฌ๋๋ ๊ณ ์  Key ๊ฐ(๋ฌธ์์ด, ๋ฐฐ์ด)

     - ๐ก queryKey ์ญํ  : React Query๊ฐ query ์บ์ฑ์ ๊ด๋ฆฌํ  ์ ์๋๋ก ๋์์ค

  4. queryFn : promise ์ฒ๋ฆฌ๊ฐ ์ด๋ฃจ์ด์ง๋ ํจ์

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
  // graphql์ด useQueryClient๊ฐ ๊ฐ์ง๊ณ  ์๋ ์บ์์ ๋ณด์ { mutate: ... }์ ์ ๋ณด๋ค์ ์๋ฐ์ดํธ ํด์ฃผ๋ ํ์
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
        // โ QueryKeys ์ง์  ํ, messages ์์  ์ ๋ณด(๋ฐ์ดํฐ) ์๋ฐ์ดํธ
        // ๊ธฐ์กด ๋ฐ์ดํฐ : old, ์๋ฐ์ดํธ ๋ฐ์ดํฐ : createMessage
        // mutation์์ return๋ ๊ฐ์ ์ด์ฉํด์ get ํจ์์ ํ๋ผ๋ฏธํฐ๋ฅผ ๋ณ๊ฒฝํด์ผํ  ๊ฒฝ์ฐ setQueryData๋ฅผ ์ฌ์ฉ
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
        // โ QueryKeys ์ง์  ํ, messages ์์  ์ ๋ณด(๋ฐ์ดํฐ) ์๋ฐ์ดํธ
        // ๊ธฐ์กด ๋ฐ์ดํฐ : old, ์๋ฐ์ดํธ ๋ฐ์ดํฐ : updateMessage
        // mutation์์ return๋ ๊ฐ์ ์ด์ฉํด์ get ํจ์์ ํ๋ผ๋ฏธํฐ๋ฅผ ๋ณ๊ฒฝํด์ผํ  ๊ฒฝ์ฐ setQueryData๋ฅผ ์ฌ์ฉ
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
        // โ QueryKeys ์ง์  ํ, messages ์์  ์ ๋ณด(๋ฐ์ดํฐ) ์๋ฐ์ดํธ
        // ๊ธฐ์กด ๋ฐ์ดํฐ : old, ์๋ฐ์ดํธ ๋ฐ์ดํฐ : deleteMessage: deletedId
        // mutation์์ return๋ ๊ฐ์ ์ด์ฉํด์ get ํจ์์ ํ๋ผ๋ฏธํฐ๋ฅผ ๋ณ๊ฒฝํด์ผํ  ๊ฒฝ์ฐ setQueryData๋ฅผ ์ฌ์ฉ
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

- ๐ก Query๋ค์ 4๊ฐ์ ์ํ๋ฅผ ๊ฐ์ง๋ฉฐ, useQuery๊ฐ ๋ฐํํ๋ ๊ฐ์ฒด์ ํ๋กํผํฐ๋ก ์ด๋ค ์ํ์ธ์ง ํ์ธ์ด ๊ฐ๋ฅํ๋ค.

  - fresh : ์๋กญ๊ฒ ์ถ๊ฐ๋ ์ฟผ๋ฆฌ ์ธ์คํด์ค โ active ์ํ์ ์์, ๊ธฐ๋ณธ staleTime์ด 0์ด๊ธฐ ๋๋ฌธ์ ์๋ฌด๊ฒ๋ ์ค์ ์ ์ํด์ฃผ๋ฉด ํธ์ถ์ด ๋๋๊ณ  ๋ฐ๋ก stale ์ํ๋ก ๋ณํ๋ค. staleTime์ ๋๋ ค์ค ๊ฒฝ์ฐ freshํ ์ํ๊ฐ ์ ์ง๋๋๋ฐ, ์ด๋๋ ์ฟผ๋ฆฌ๊ฐ ๋ค์ ๋ง์ดํธ๋๋ ํจ์นญ์ด ๋ฐ์ํ์ง ์๊ณ  ๊ธฐ์กด์ freshํ ๊ฐ์ ๋ฐํํ๋ค.
  - fetching : ์์ฒญ์ ์ํํ๋ ์ค์ธ ์ฟผ๋ฆฌ
  - stale : ์ธ์คํด์ค๊ฐ ์กด์ฌํ์ง๋ง ์ด๋ฏธ ํจ์นญ์ด ์๋ฃ๋ ์ฟผ๋ฆฌ. ํน์  ์ฟผ๋ฆฌ๊ฐ stale๋ ์ํ์์ ๊ฐ์ ์ฟผ๋ฆฌ ๋ง์ดํธ๋ฅผ ์๋ํ๋ค๋ฉด ์บ์ฑ๋ ๋ฐ์ดํฐ๋ฅผ ๋ฐํํ๋ฉด์ ๋ฆฌํจ์นญ์ ์๋ํ๋ค.
  - inactive : active ์ธ์คํด์ค๊ฐ ํ๋๋ ์๋ ์ฟผ๋ฆฌ. inactive๋ ์ดํ์๋ cacheTime ๋์ ์บ์๋ ๋ฐ์ดํฐ๊ฐ ์ ์ง๋๋ค. cacheTime์ด ์ง๋๋ฉด GC๋๋ค.

<br/>

- ๐ก unique key : ํ ๋ฒ fresh๊ฐ ๋์๋ค๋ฉด ๊ณ์ ์ถ์ ์ด ๊ฐ๋ฅํ๋ค. ๋ฆฌํจ์นญ, ์บ์ฑ, ๊ณต์  ๋ฑ์ ํ ๋ ์ฐธ์กฐ๋๋ ๊ฐ. ์ฃผ๋ก ๋ฐฐ์ด์ ์ฌ์ฉํ๊ณ , ๋ฐฐ์ด์ ์์๋ก ์ฟผ๋ฆฌ์ ์ด๋ฆ์ ๋ํ๋ด๋ ๋ฌธ์์ด๊ณผ ํ๋ก๋ฏธ์ค๋ฅผ ๋ฆฌํดํ๋ ํจ์์ ์ธ์๋ก ์ฐ์ด๋ ๊ฐ์ ๋ฃ๋๋ค.

<br/>

- ๐ก Caching Process
  - useQuery์ ์ฒซ๋ฒ์งธ, ์๋ก์ด ์ธ์คํด์ค ๋ง์ดํธ โ ๋ง์ฝ์ ๋ฐํ์๊ฐ ์ต์ด๋ก freshํ ํด๋น ์ฟผ๋ฆฌ๊ฐ ํธ์ถ๋์๋ค๋ฉด, ์บ์ฑํ๊ณ , ํจ์นญ์ด ๋๋๋ฉด ํด๋น ์ฟผ๋ฆฌ๋ฅผ stale๋ก ๋ฐ๊ฟ(staleTime:0)
  - ์ฑ ์ด๋๊ฐ์์ useQuery ๋๋ฒ์งธ ์ธ์คํด์ค ๋ง์ดํธ โ ์ด๋ฏธ ์ฟผ๋ฆฌ๊ฐ stale์ด๋ฏ๋ก ์ ๋ ์์ฒญ๋ ๋ง๋ค์ด ๋จ์๋ ์บ์๋ฅผ ๋ฐํํ๊ณ  ๋ฆฌํจ์นญ์ ํจ. ์ด๋ ์บ์๋ ์๋ฐ์ดํธ.
  - ์ฟผ๋ฆฌ๊ฐ ์ธ๋ง์ดํธ๋๊ฑฐ๋ ๋์ด์ ์ฌ์ฉํ์ง ์์ ๋ โ ๋ง์ง๋ง ์ธ์คํด์ค๊ฐ ์ธ๋ง์ดํธ๋์ด inactive ์ํ๊ฐ ๋์์๋ 5๋ถ(cacheTime์ ๊ธฐ๋ณธ๊ฐ)์ด ์ง๋๋ฉด ์๋์ผ๋ก ์ญ์ ํ๋ค.

<br/>

[React Query ๋ ์์๋ณด๊ธฐ\_1](https://kyounghwan01.github.io/blog/React/react-query/basic/#api)<br/>
[React Query ๋ ์์๋ณด๊ธฐ\_2](https://maxkim-j.github.io/posts/react-query-preview)<br/>
[React Query ๋ ์์๋ณด๊ธฐ\_3](https://fe-developers.kakaoent.com/2022/220224-data-fetching-libs/)<br/>
[React Query ๋ ์์๋ณด๊ธฐ\_4](https://jforj.tistory.com/243?category=877028)<br/>

<br/>
<br/>

---

---

<br/>
<br/>

### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(ch6)

<br/>

---

<br/>

### ๐  . Client - GraphQL ๋ฌดํ์คํฌ๋กค(ch6)

- useInfiniteQuery ์ ์ฉํ๊ธฐ
- ๋ฌดํ์คํฌ๋กค ํ๊ฒฝ์์ mutation ์ฒ๋ฆฌ ๋ฐ ๊ธฐ๋ฅ ๋ณด์

<br/>

---

<br/>

- GraphQL server ์ค์ 

```javascript
// ch6/server/src/schema/message.js

import { gql } from 'apollo-server-express'

//cursor: ID) ์ถ๊ฐ
const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    userId: ID!
    user: User!
    timestamp: Float #13์๋ฆฌ ์ซ์
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
parent: parent ๊ฐ์ฒด. ๊ฑฐ์ ์ฌ์ฉX
args: Query์ ํ์ํ ํ๋์ ์ ๊ณต๋๋ ์ธ์(parameter)
context: ๋ก๊ทธ์ธํ ์ฌ์ฉ์. DB Access ๋ฑ์ ์ค์ํ ์ ๋ณด๋ค
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

- getServerSideProps ์ง๋ ฌ๊ตฌ์กฐ => ๋ณ๋ ฌ๊ตฌ์กฐ ๋ณํ
  - ๋ฐ์ดํฐ๋ฅผ ๋์์ ์๋ต ๋ฐ๊ธฐ ์ํด ๋ณ๋ ฌ๊ตฌ์กฐ๋ก ๋ณํ

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

- client/graphql ์์ 

```jsx
// ch6/client/graphql/message.js

import gql from 'graphql-tag'

// ($cursor: ID) ์ถ๊ฐ
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

  1. useQuery์ ๋ค๋ฅธ ๊ตฌ์กฐ์ธ pageParams์ pages ๋ฅผ ๋ฐ๊ณ , API๋ฅผ ํธ์ถํ ๊ฒฐ๊ณผ๋ฅผ pages ๋ฐฐ์ด ์์ ๊ฐ๊ณ  ์์

  2. pageParam : useInfiniteQuery๊ฐ ํ์ฌ ์ด๋ค ํ์ด์ง์ ์๋์ง๋ฅผ ํ์ธํ  ์ ์๋ ํ๋ผ๋ฏธํฐ ๊ฐ, pageParams ๋ค์๊ณผ ๊ฐ์ด queryFn์ ํ๋ผ๋ฏธํฐ ๊ฐ์์ ํ์ธํ  ์ ์์

  3. getNextPageParam : ๋ค์ ํ์ด์ง์ ์๋ ๋ฐ์ดํฐ๋ฅผ ์กฐํํด์ฌ ๋ ์ฌ์ฉ

     - ๋ค์ api๋ฅผ ์์ฒญํ  ๋ ์ฌ์ฉ๋  pageParam๊ฐ์ ์ ํ  ์ ์์
     - return ๋๋ ๊ฐ์ด ๋ค์ ํ์ด์ง๊ฐ ํธ์ถ๋  ๋ pageParam ๊ฐ์ผ๋ก ์ฌ์ฉ

  4. hasNextPage: cursor(ํ์ฌ ์์น)๊ฐ ๋์ ์๋์ง ์๋ ค์ฃผ๋ ํจ์(๋ง์ฝ ๋ค์ ํ์ด์ง์ ์์ ๋, true)

  5. fetchNextPage: ๋ค์ ํ์ด์ง์ ๋ฐ์ดํฐ๋ฅผ ํธ์ถํ  ๋ ์ฌ์ฉ

     - useInfiniteQuery์ return ๊ฐ์ ํฌํจ๋๋ฉฐ ๋ค์๊ณผ ๊ฐ์ด ๋ฒํผ์ ํด๋ฆญํ  ๋ ์คํ๋  ์ด๋ฒคํธ๋ก ๋ฑ๋กํด์ค ์ ์์

  6. ๐ก hasNextPage๋ Boolean ๊ฐ์ ๋ฐํ, hasNextPage์ ๊ฐ์ด true์ผ ๋ fetchNextPage ํจ์๋ฅผ ์คํ์์ผ์ฃผ๋ฉด infiniteQuery๋ฅผ ๊ตฌํํ  ์ ์์

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

  // const [msgs, setMsgs] = useState({ messages: smsgs }); / flatMap() ์ฌ์ฉ์
  const [msgs, setMsgs] = useState([{ messages: smsgs }]);
  const [editingId, setEditingId] = useState(null);

  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const doneEdit = () => setEditingId(null);

  // setQueryData
  //   - ๊ธฐ์กด์ queryKey์ ๋งคํ๋์ด ์๋ ๋ฐ์ดํฐ๋ฅผ ์๋กญ๊ฒ ์ ์
  //   - ์๋ฒ์ ๋ค์ ๋ฐ์ดํฐ๋ฅผ ์์ฒญํ์ง ์๊ณ ๋ ์ฌ์ฉ์ ํ๋ฉด์ ๋ณ๊ฒฝ๋ ๋ฐ์ดํฐ๋ฅผ ํจ๊ป ๋ณด์ฌ์ค ์ ์์
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

  // - fetchNextPage: ๋ค์ ํ์ด์ง์ ๋ฐ์ดํฐ๋ฅผ ํธ์ถํ  ๋ ์ฌ์ฉ
  // - hasNextPage: cursor(ํ์ฌ ์์น)๊ฐ ๋์ ์๋์ง ์๋ ค์ฃผ๋ ํจ์(๋ง์ฝ ๋ค์ ํ์ด์ง์ ์์ ๋, true)
  // - getNextPageParam : ๋ค์ ํ์ด์ง์ ์๋ ๋ฐ์ดํฐ๋ฅผ ์กฐํํด์ฌ ๋ ์ฌ์ฉ
  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    QueryKeys.MESSAGES,
    ({ pageParam = "" }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: ({ messages }) => {
        return messages?.[messages.length - 1]?.id; // ๋ค์ ํ์ด์ง๋ฅผ ํธ์ถํ  ๋ ์ฌ์ฉ ๋  pageParam
      },
    }
  );

  useEffect(() => {
    if (!data?.pages) return;
    // const data.pages = [ {messages: [...]}, {messages: [...]} ] -> [...] / ๋จ์ผํ ๋ฐฐ์ด๋ก ๋ณํฉ : flatMap()
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
        {/* msgs.map( x => (...)) / flatMap() ์ฌ์ฉ์ */}
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
