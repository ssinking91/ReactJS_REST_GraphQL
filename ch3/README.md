### 💫 토이프로젝트 클론코딩으로 REST API 및 GraphQL 연습하기(client)

<br/>

---

<br/>

### 🛠 . Client - REST API 통신(ch3)

- 클라이언트에서 REST API로 데이터 통신하기
- 무한스크롤 구현하기
- 서버사이드 렌더링

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

- [무한스크롤 구현하기](https://heropy.blog/2019/10/27/intersection-observer/)

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
  // 최초로 한번 데이터 불러오기 방지 => useRef(null)
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
