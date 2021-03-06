### ๐ซ ํ ์ดํ๋ก์ ํธ ํด๋ก ์ฝ๋ฉ์ผ๋ก REST API ๋ฐ GraphQL ์ฐ์ตํ๊ธฐ(client)

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
