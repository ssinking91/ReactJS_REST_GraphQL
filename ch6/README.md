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
