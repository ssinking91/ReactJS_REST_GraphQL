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
  3. sLoading, isError, refetch, Data Caching 등 기능을 제공

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
// _app.js에서 React Query 초기화 작업
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

- React Query의 useQuery 사용

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

---

<br/>
