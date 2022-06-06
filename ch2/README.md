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

---
