// file system, path의 resolve는 lowdb가 알아서해주므로 삭제합시다.
import { LowSync, JSONFileSync } from "lowdb";

// 경로를 ./src/db.json으로 설정. 모두 한곳에 뭉칠 겁니다.
// 현재 server/src/db 폴더에 messages.json, users.json이 있는데, 이를 server/src/db.json 파일로 한데 묶을려고 계획중입니다.
// server/src/db.json이라는 하나의 파일 안에서 messages, users가 모두 있도록 하겠습니다.
const adapter = new JSONFileSync("./src/db.json");

// 그리고 db라는 걸 만들겁니다.
const db = new LowSync(adapter);

// db에서 이제 write, read라는 명령을 쓰게 될겁니다.
export default db;
