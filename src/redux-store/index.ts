// Third-party Imports
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Slice Imports
import chatReducer from '@/redux-store/slices/chat';
import calendarReducer from '@/redux-store/slices/calendar';
import kanbanReducer from '@/redux-store/slices/kanban';
import emailReducer from '@/redux-store/slices/email';
import authReducer from '@/redux-store/slices/auth/authSlice';
import layoutReducer from '@/redux-store/slices/layout/layoutSlice';
import themeReducer from '@/redux-store/slices/theme/themeSlice';
import { accountingReducer } from '@/redux-store/slices/accounting';
import { leaveReducer } from '@/redux-store/slices/leave';
import posReducer from '@/redux-store/slices/pos/posSlice';

// Create root reducer
const rootReducer = combineReducers({
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  email: emailReducer,
  auth: authReducer,
  layout: layoutReducer,
  theme: themeReducer,
  accounting: accountingReducer,
  leave: leaveReducer,
  pos: posReducer,
});

// Custom transform to handle non-serializable values
const transform = {
  in: (state: any) => {
    // Convert any non-serializable values in the chat state
    if (state?.chat?.chats) {
      return {
        ...state,
        chat: {
          ...state.chat,
          chats: state.chat.chats.map((chat: any) => ({
            ...chat,
            time: chat.time ? new Date(chat.time) : new Date(),
          })),
        },
      };
    }
    return state;
  },
  out: (state: any) => {
    // Convert Date objects to strings when saving to storage
    if (state?.chat?.chats) {
      return {
        ...state,
        chat: {
          ...state.chat,
          chats: state.chat.chats.map((chat: any) => ({
            ...chat,
            time: chat.time instanceof Date ? chat.time.toISOString() : chat.time,
          })),
        },
      };
    }
    return state;
  },
};

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  // Only persist these reducers
  whitelist: ['auth', 'theme'],
  version: 1,
  // Use transforms to handle non-serializable values
  transforms: [transform],
  // Don't persist these reducers
  blacklist: ['calendar', 'chat', 'kanban', 'email', 'accounting']
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore non-serializable values in these paths
        ignoredPaths: [
          'accounting.selectedEntry', 
          'accounting.filters.startDate', 
          'accounting.filters.endDate',
          'chat.chats',
          'calendar.events',
          'calendar.filteredEvents',
          'calendar.selectedEvent',
          'calendar.selectedEvents',
          'kanban.tasks', // Ignore non-serializable dueDate in tasks
          'email.emails', // Ignore non-serializable time in emails
        ],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store, {
  // Add additional configuration if needed
});

// Helper to purge persisted state
export const purgePersistedState = () => {
  persistor.purge();
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export custom hooks for use throughout the app
export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
