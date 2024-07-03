import {
    createEntityAdapter,
    createSlice,
  } from '@reduxjs/toolkit';
  
  export const ROOT_FEATURE_KEY = 'rootState';
  
  export interface RootEntity {
    id: number;
  }

  type LoadingType = 'not loaded' | 'loading' | 'loaded' | 'error'
  
  export interface RootState {
    loadingStatus: LoadingType;
    error?: string | null;
    isLogin: boolean;
    role?: 'admin' | 'user',
    userFavs: string[]
  }
  
  export const rootAdapter = createEntityAdapter<RootEntity>();
  
  export const initialRootState: RootState = rootAdapter.getInitialState(
    {
      loadingStatus: 'not loaded',
      error: null,
      filters: {},
      isLogin: false,
      userFavs: []
    }
  );
  
  export const rootSlice = createSlice({
    name: ROOT_FEATURE_KEY,
    initialState: initialRootState,
    reducers: {
      setLoading(state, action: {payload: LoadingType}) {
        state.loadingStatus = action.payload
      },
      setLogin(state, action: {payload: "admin" | "user"}) {
        state.isLogin = true;
        state.role = action.payload
      },
      setFavs(state, action: {payload: string[]}) {
        state.userFavs = action.payload
      },
      logout(state) {
        state.isLogin = false;
        state.role = undefined;
        state.userFavs = []
      }
    },
  });
  
  export const listingReducer = rootSlice.reducer;
  
  export const listingActions = rootSlice.actions;
  
  export const getRootState = (rootState: {
    [ROOT_FEATURE_KEY]: RootState;
  }): RootState => rootState[ROOT_FEATURE_KEY];

  