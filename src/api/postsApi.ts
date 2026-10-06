import type { Post, PostInput, PostsResponse } from '../types';
import { http } from './client';

export async function getPosts(
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<PostsResponse> {
  const { data } = await http.get<PostsResponse>('/posts', { params: { limit, skip }, signal });
  return data;
}

export async function searchPosts(
  q: string,
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<PostsResponse> {
  const { data } = await http.get<PostsResponse>('/posts/search', {
    params: { q, limit, skip },
    signal,
  });
  return data;
}

type CreatedPost = PostInput & { id: number };

export async function createPostRequest(input: PostInput): Promise<Post> {
  const { data } = await http.post<CreatedPost>('/posts/add', input);
  return { ...data, reactions: { likes: 0, dislikes: 0 }, views: 0 };
}

export async function updatePostRequest(id: number, input: PostInput): Promise<Post> {
  const { data } = await http.put<Post>(`/posts/${id}`, input);
  return data;
}

export async function deletePostRequest(id: number): Promise<void> {
  await http.delete(`/posts/${id}`);
}