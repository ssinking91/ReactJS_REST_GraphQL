import { gql } from "apollo-server-express";
import messageSchema from "./message.js";
import userSchema from "./user.js";

// type Query 정의의 중복을 피하기 위해 extend 사용, 한곳으로 묶기 위해 linkSchema 정의
const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, messageSchema, userSchema];
