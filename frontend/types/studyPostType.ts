import { commentType } from "./commentType";

export interface studyPostType {
    id : string;
    name: string;
    content: string;
    file: string;
    fileName: string;
    is_processed: boolean;
    createdAt: string;
    comments: commentType[];
}