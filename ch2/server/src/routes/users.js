import { readDB } from "../dbController.js";

// DB 설정
const getUsers = () => readDB("users");

// route
// Syntax : app.[method](route, handler)

const usersRoute = [
  {
    method: "get",
    route: "/users",
    handler: (req, res) => {
      const users = getUsers();
      res.send(users);
    },
  },
  {
    method: "get",
    route: "/users/:id",
    handler: ({ params: { id } }, res) => {
      try {
        const users = getUsers();
        const user = users[id];
        if (!user) throw Error("사용자가 없습니다.");
        res.send(user);
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
];

export default usersRoute;
