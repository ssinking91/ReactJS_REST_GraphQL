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
