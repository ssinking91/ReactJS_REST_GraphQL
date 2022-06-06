### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기

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
