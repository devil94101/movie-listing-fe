import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {rootSlice} from './slices/root.slice'

const rootPersistConfig = {
  timeout: 10,
  key: 'root',
  storage: storage,
  blacklist: [],
  whitelist: [rootSlice.name],
};

const rootReducer = combineReducers({
  [rootSlice.name]: rootSlice.reducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export const ReduxStore =  store;
