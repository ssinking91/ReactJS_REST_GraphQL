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
