import { commentType } from "./commentType";

export interface PostType {
  id : string;
  name: string;
  content: string;
  file: string;
  createdAt: string;
  comments: commentType[];
}
