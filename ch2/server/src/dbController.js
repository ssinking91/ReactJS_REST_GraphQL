import fs from "fs"; // fs 모듈은 FileSystem의 약자로 파일 처리와 관련된 Node.js 모듈
import { resolve } from "path"; // path 모듈은 파일과 폴더의 경로 작업을 위한 기능을 제공하는 Node.js 기본 모듈

const basePath = resolve(); // 현재경로
const filenames = {
  messages: resolve(basePath, "src/db/messages.json"),
  users: resolve(basePath, "src/db/users.json"),
};

// 1. 파일 읽기(read)
// fs.readFileSync(filename, [options])
//   - filename의 파일을 [options]의 방식으로 읽은 후 문자열을 반환합니다. (동기적)
//   - [options]에는 보통 인코딩 방식이 오게 되며 웹에서는 utf8을 주로 사용
// 동기적 방식의 예외처리
//   - 동기적 방식에서는 자바스크립트의 일반적인 예외처리 방식인 try ~ catch 구문으로 처리
export const readDB = (target) => {
  try {
    return JSON.parse(fs.readFileSync(filenames[target], "utf-8"));
  } catch (err) {
    console.error(err);
  }
};

// 2. 파일 쓰기(write)
// fs.writeFileSync(filename, data, [options])
//   - filename의 파일에 [options]의 방식으로 data 내용을 씁니다. (동기적)
//   - [options]에는 보통 인코딩 방식이 오게 되며 웹에서는 utf8을 주로 사용
// 동기적 방식의 예외처리
//   - 동기적 방식에서는 자바스크립트의 일반적인 예외처리 방식인 try ~ catch 구문으로 처리
export const writeDB = (target, data) => {
  try {
    return fs.writeFileSync(filenames[target], JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

// __filename : 현재 파일 경로
// __dirname : 현재 폴더 경로
