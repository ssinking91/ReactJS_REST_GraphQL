// schema에서 정의했던 명령어들 참고(Query, Mutation)
// context는 src/index.js context와 같음
// Object.values() : 값들로 이루어진 배열을 리턴
const userResolver = {
  Query: {
    users: (parent, args, { db }) => Object.values(db.users),
    user: (parent, { id }, { db }) => db.users[id],
  },
};

export default userResolver;
