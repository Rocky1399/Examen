import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createPostRequest,
  deletePostRequest,
  getPosts,
  getPostsByTag,
  getPostsByUser,
  getTagList,
  searchPosts,
  updatePostRequest,
} from '../../api/postsApi';
import { createAppAsyncThunk } from '../../store/createAppAsyncThunk';
import type { Post, PostInput, RequestStatus } from '../../types';
import { logout } from '../auth/authSlice';

export interface PostsQuery {
  page: number;
  rows: number;
  search: string;
  userId: number | null;
  tags: string[];
}

export const DEFAULT_QUERY: PostsQuery = { page: 1, rows: 10, search: '', userId: null, tags: [] };

interface PostsState {
  items: Post[]; 
  total: number;
  query: PostsQuery;
  status: RequestStatus;
  error: string | null;
  saving: boolean;
  removed: Record<number, { post: Post; index: number }>;
  tags: string[];
}

const initialState: PostsState = {
  items: [],
  total: 0,
  query: DEFAULT_QUERY,
  status: 'idle',
  error: null,
  saving: false,
  removed: {},
  tags: [],
};

export const fetchPosts = createAppAsyncThunk<{ posts: Post[]; total: number }, PostsQuery>(
  'posts/fetchPage',
  async (query, { rejectWithValue, signal }) => {
    try {
      const skip = (query.page - 1) * query.rows;
      const hasFilters = query.search !== '' || query.userId !== null || query.tags.length > 0;

      if (!hasFilters) {
        const data = await getPosts(query.rows, skip, signal);
        return { posts: data.posts, total: data.total };
      }

      let candidates: Post[];
      if (query.search !== '') {
        candidates = (await searchPosts(query.search, 0, 0, signal)).posts;
      } else if (query.userId !== null) {
        candidates = await getPostsByUser(query.userId, signal);
      } else {
        candidates = await getPostsByTag(query.tags[0], signal);
      }

      const filtered = candidates.filter(
        (post) =>
          (query.userId === null || post.userId === query.userId) &&
          query.tags.every((tag) => post.tags.includes(tag)),
      );

      return { posts: filtered.slice(skip, skip + query.rows), total: filtered.length };
    } catch {
      return rejectWithValue('No se pudieron cargar las publicaciones.');
    }
  },
);

export const fetchTags = createAppAsyncThunk<string[], void>(
  'posts/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      return await getTagList();
    } catch {
      return rejectWithValue('No se pudieron cargar los tags.');
    }
  },
);

export const createPost = createAppAsyncThunk<Post, PostInput>(
  'posts/create',
  async (input, { rejectWithValue }) => {
    try {
      return await createPostRequest(input);
    } catch {
      return rejectWithValue('No se pudo crear la publicación.');
    }
  },
);

export const updatePost = createAppAsyncThunk<Post, { id: number; changes: PostInput }>(
  'posts/update',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      return await updatePostRequest(id, changes);
    } catch {
      return rejectWithValue('No se pudo guardar la publicación.');
    }
  },
);

export const deletePost = createAppAsyncThunk<number, Post>(
  'posts/delete',
  async (post, { rejectWithValue }) => {
    try {
      await deletePostRequest(post.id);
      return post.id;
    } catch {
      return rejectWithValue('No se pudo eliminar la publicación.');
    }
  },
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<{ page: number; rows: number }>) {
      state.query.page = action.payload.page;
      state.query.rows = action.payload.rows;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.query.search = action.payload;
      state.query.page = 1;
    },
    setUserFilter(state, action: PayloadAction<number | null>) {
      state.query.userId = action.payload;
      state.query.page = 1;
    },
    setTagsFilter(state, action: PayloadAction<string[]>) {
      state.query.tags = action.payload;
      state.query.page = 1;
    },
    resetFilters(state) {
      state.query = { ...DEFAULT_QUERY, rows: state.query.rows };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.posts;
        state.total = action.payload.total;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload ?? 'Error';
      })

      .addCase(createPost.pending, (state) => {
        state.saving = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createPost.rejected, (state) => {
        state.saving = false;
      })
      .addCase(updatePost.pending, (state) => {
        state.saving = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.map((p) => (p.id === action.payload.id ? action.payload : p));
      })
      .addCase(updatePost.rejected, (state) => {
        state.saving = false;
      })

      .addCase(deletePost.pending, (state, action) => {
        const post = action.meta.arg;
        const index = state.items.findIndex((p) => p.id === post.id);
        if (index === -1) return;
        state.removed[post.id] = { post, index };
        state.items.splice(index, 1);
        state.total -= 1;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        delete state.removed[action.meta.arg.id];
      })
      .addCase(deletePost.rejected, (state, action) => {
        const backup = state.removed[action.meta.arg.id];
        if (!backup) return;
        state.items.splice(backup.index, 0, backup.post);
        state.total += 1;
        delete state.removed[action.meta.arg.id];
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
      })
      .addCase(logout, () => initialState);
  },
});

export const { setPage, setSearch, setUserFilter, setTagsFilter, resetFilters } =
  postsSlice.actions;
export default postsSlice.reducer;