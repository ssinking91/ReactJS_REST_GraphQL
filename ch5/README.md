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

---

<br/>
