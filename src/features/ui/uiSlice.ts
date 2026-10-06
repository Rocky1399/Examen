import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

export interface ToastMessage {
  id: string;
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
}

interface UiState {
  toasts: ToastMessage[];
  pendingRequests: number;
}

const initialState: UiState = { toasts: [], pendingRequests: 0 };

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: {
      reducer(state, action: PayloadAction<ToastMessage>) {
        state.toasts.push(action.payload);
      },
      prepare(toast: Omit<ToastMessage, 'id'>) {
        return { payload: { ...toast, id: nanoid() } };
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.pendingRequests += 1;
      })
      .addMatcher(isFulfilled, (state) => {
        state.pendingRequests -= 1;
      })
      .addMatcher(isRejected, (state, action) => {
        state.pendingRequests -= 1;
        if (action.meta.aborted) return;
        const detail = typeof action.payload === 'string' ? action.payload : action.error.message;
        state.toasts.push({ id: nanoid(), severity: 'error', summary: 'Error', detail });
      });
  },
});

export const { showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
