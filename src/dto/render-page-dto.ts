import { UserDto } from "./user-dto";
import { PostDto } from "./post-dto";
import { CommentDto } from "./comment-dto";

export interface RenderPageDto {
    title: string;
    user?: UserDto;
    users?: UserDto[];
    posts?: PostDto[];
    post?: PostDto;
    username?: string;
    allPosts?: boolean;
    comments?: CommentDto[]
}