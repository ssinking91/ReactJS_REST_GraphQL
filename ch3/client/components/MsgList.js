import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import fetcher from "../fetcher";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const MsgList = ({ smsgs, users }) => {
  // const { query: { userId = '' } } = useRouter();
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";

  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);

  // 마지막 데이터일시 무한스크롤 중단
  const [hasNext, setHasNext] = useState(true);

  // 무한스크롤 Ref
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
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      // params로 데이터를 보내주지만, 실제로는 Query_string으로 보내지게 됨
      // `/messages/${id}/?userId=${userId}`와 같은 형태됨
      params: { userId },
    });
    // console.log( typeof receivedId, typeof id )
    setMsgs((msgs) => {
      // receivedId + "" => type을 String으로 변환
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId + "");
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const doneEdit = () => setEditingId(null);

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
            user={users[x.userId]}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} style={{ paddingBottom: "1px" }} />
    </>
  );
};

export default MsgList;
