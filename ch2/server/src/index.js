import express from "express";
import cors from "cors";
import messagesRoute from "./routes/messages.js";
import usersRoute from "./routes/users.js";

const app = express();

// 클라이언트로 부터 받은 http 요청 메시지 형식에서 body데이터를 해석하기 위해서
//  - express.urlencoded()와 express.json()로 처리가 필요

// 결론
//  - .urlencoded()은 x-www-form-urlencoded 형태의 데이터를
//  - .json()은 JSON형태의 데이터를 해석하여 사용
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 특정 도메인에만 허용하기
//  - cors: 해당 도메인은 제한 없이 해당 서버에 요청을 보내고 응답을 받을 수 있음
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// route
const routes = [...messagesRoute, ...usersRoute];

// Syntax : app.[method](route, handler)
routes.forEach(({ method, route, handler }) => {
  app[method](route, handler);
});

// 앱은 서버를 시작하며 8000 포트에서 연결을 청취
// Syntax : app.listen([port], [host], [backlog], [callback])
// 앱 서버 실행시 callback함수 실행
app.listen(8000, () => {
  console.log("server listening on 8000...");
});
