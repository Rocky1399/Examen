import { createSelector, createSlice } from '@reduxjs/toolkit';
import { getUsers } from '../../api/usersApi';
import { createAppAsyncThunk } from '../../store/createAppAsyncThunk';
import type { RootState } from '../../store';
import type { RequestStatus, User } from '../../types';
import { logout } from '../auth/authSlice';

interface UsersState {
  items: User[];
  status: RequestStatus;
}

const initialState: UsersState = { items: [], status: 'idle' };

export const fetchUsers = createAppAsyncThunk<User[], void>(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getUsers();
    } catch {
      return rejectWithValue('No se pudieron cargar los usuarios.');
    }
  },
  {
    // Si devuelve false, el thunk NO se ejecuta (ni siquiera despacha pending)
    condition: (_, { getState }) => {
      const { status } = getState().users;
      return status === 'idle' || status === 'failed';
    },
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(logout, () => initialState);
  },
});

export default usersSlice.reducer;

export const selectUserOptions = createSelector(
  [(state: RootState) => state.users.items],
  (users) => users.map((u) => ({ label: `${u.firstName} ${u.lastName}`, value: u.id })),
);