export interface postType {
  name: string;
  content: string;
  file: string;
  createdAt: string;
  comments: {
    name: string;
    content: string;
    createdAt: string;
  }[];
}
