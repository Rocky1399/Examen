export interface Post {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: {likes: number; dislikes: number};
    views: number;
    userId: number;
    isLocal?: boolean;
}

export type PostInput = Pick<Post, 'title' | 'body' | 'userId' | 'tags'>;

export interface User{
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
}

export interface PostsResponse {
    posts: Post[];
    total: number;
    skip: number;
    limit: number;
}

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
}

export interface Credentials {
    username: string;
    password: string;
}

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'