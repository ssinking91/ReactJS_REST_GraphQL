import { v4 } from "uuid";
import db from "../dbController.js";

const getMsgs = () => {
  // lowdb에서 제공하는 기능입니다. db.read(); 메소드는 db 자체를 읽어오는 기능을 수행합니다.
  db.read();

  // 이 db는 계속 캐시에 남아있는 상태여서, 만약에 db.data가 있으면 db.data를 계속해서 사용하고
  // 없을 경우에는 messages를 다시 빈 배열로 만들어주는 안전장치를 마련합니다.
  db.data = db.data || { messages: [] };
  return db.data.messages;
};

const messagesRoute = [
  {
    // GET MESSAGES
    method: "get",
    route: "/messages",
    handler: ({ query: { cursor = "" } }, res) => {
      const msgs = getMsgs();
      const fromIndex = msgs.findIndex((msg) => msg.id === cursor) + 1;
      res.send(msgs.slice(fromIndex, fromIndex + 15));
    },
  },
  {
    // GET MESSAGE
    method: "get",
    route: "/messages/:id",
    handler: ({ params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const msg = msgs.find((m) => m.id === id);
        if (!msg) throw Error("not found");
        res.send(msg);
      } catch (err) {
        res.status(404).send({ error: err });
      }
    },
  },
  {
    // CREATE MESSAGE
    method: "post",
    route: "/messages",
    handler: ({ body }, res) => {
      try {
        if (!body.userId) throw Error("no userId");
        const msgs = getMsgs();
        const newMsg = {
          id: v4(),
          text: body.text,
          userId: body.userId,
          timestamp: Date.now(),
        };
        db.data.messages.unshift(newMsg);
        // db.write() 코드로 db에 쓸 수 있다.
        db.write();
        res.send(newMsg);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
  {
    // UPDATE MESSAGE
    method: "put",
    route: "/messages/:id",
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw "메시지가 없습니다.";
        if (msgs[targetIndex].userId !== body.userId)
          throw "사용자가 다릅니다.";

        const newMsg = { ...msgs[targetIndex], text: body.text };
        db.data.messages.splice(targetIndex, 1, newMsg);
        // db.write() 코드로 db에 쓸 수 있다.
        db.write();
        res.send(newMsg);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
  {
    // DELETE MESSAGE
    method: "delete",
    route: "/messages/:id",
    handler: ({ params: { id }, query: { userId } }, res) => {
      try {
        const msgs = getMsgs();
        const targetIndex = msgs.findIndex((msg) => msg.id === id);
        if (targetIndex < 0) throw "메시지가 없습니다.";
        if (msgs[targetIndex].userId !== userId) throw "사용자가 다릅니다.";

        db.data.messages.splice(targetIndex, 1);
        db.write();
        res.send(id);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
];

export default messagesRoute;
