### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(json-server)

<br/>

---

<br/>

### 🛠 . json-server

- json-server

---

<br/>

- cd json-server
- cd server

```jsx
// json-server/server

yarn add json-server
```

---

<br/>

- [json-server](https://hyungju-lee.github.io/hyungju-lee2021_2.github.io/categories/study/react_restapi_graphql/react_restapi_graphql8.html)

  - 아주 짧은 시간에 REST API 를 구축해주는 라이브러리

1. server/src/index.js 변경

```javascript
// server/src/index.js

import jsonServer from "json-server";
import cors from "cors";
import messagesRoute from "./routes/messages.js";

// express 서버 대신 jsonServer를 create 합니다.
const app = jsonServer.create();

// 그리고 router라는게 있는데 이 router는 우리가 만들어놓은 아래 routes랑 별개로 jsonServer가 자동으로 db에있는 json 구조를 바탕으로 알아서 라우트를 만들어줍니다.
// 이것이 jsonServer가 제공하는 기능입니다.
const router = jsonServer.router("./src/db.json");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 여기서 app.use로 jsonServer에 있는 bodyParser를 사용하겠다 라고 해줍니다.
// 이 부분은 request에 body가 내려오는데 이 body 부분에 접근하게끔 해주는 녀석입니다.
app.use(jsonServer.bodyParser);

const routes = messagesRoute;
routes.forEach(({ method, route, handler }) => {
  app[method](route, handler);
});

app.use(router);

app.listen(8000, () => {
  console.log("server listening on 8000...");
});
```

<br/>

2. 무한스크롤 client/components/MsgList.js 변경

```jsx
// client/components/MsgList.js

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import fetcher from "../fetcher";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const MsgList = ({ smsgs, users }) => {
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";

  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) throw Error("something wrong");
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher("put", `/messages/${id}`, { text, userId });
    if (!newMsg) throw Error("something wrong");
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  const onDelete = async (id) => {
    await fetcher("delete", `/messages/${id}`, { params: { userId } });
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const doneEdit = () => setEditingId(null);

  const getMessages = async () => {
    // _start 값을 계산하는 것이 낫겠습니다. msgs 갯수가 15개면 15부터 불러오면 되는거니깐.
    const _start = msgs.length;
    // 그럼 _end는 _start에 15개를 더한값이 되면되겠죠?
    const _end = _start + 15;

    // getMessages를 요청할 때 params에 cursor 대신에 _start가 되면 되는겁니다.
    const newMsgs = await fetcher("get", "/messages", {
      params: { _start, _end, _sort: "timestamp", _order: "desc" },
    });
    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }
    setMsgs((msgs) => [...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

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
            user={users.find((user) => user.id === x.userId)}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
```

<br/>

3. 최초 접속시를 고려 getServerSideProps 변경

```jsx
import MsgList from "../components/MsgList";
import fetcher from "../fetcher";

const Home = ({ smsgs, users }) => (
  <>
    <h1>SIMPLE SNS</h1>
    <MsgList smsgs={smsgs} users={users} />
  </>
);

export const getServerSideProps = async () => {
  const smsgs = await fetcher(
    "get",
    "/messages?_start=0&_end=15&_sort=timestamp&_order=desc"
  );

  const users = await fetcher("get", "/users");
  return {
    props: { smsgs, users },
  };
};

export default Home;
```
