import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { TLoginData, TUser } from '@utils-types';
import { setCookie } from '../../utils/cookie';
import { RootState } from '../store';

export interface UserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string | null;
}

const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: null,
  error: null
};
// регистрация
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      setCookie('accessToken', response.accessToken.split('Bearer ')[1], {
        expires: 20 * 60
      });
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed'
      );
    }
  }
);

//вход
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    return response.user;
  }
);

//гет данных
export const getUser = createAsyncThunk(
  'auth/user',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      if ((error as Error).message.includes('jwt expired')) {
        try {
          const refreshData = await refreshToken();
          setCookie(
            'accessToken',
            refreshData.accessToken.split('Bearer ')[1],
            { expires: 20 * 60 }
          );
          localStorage.setItem('refreshToken', refreshData.refreshToken);

          const newResponse = await getUserApi();
          return newResponse.user;
        } catch (refreshError) {
          dispatch(logout());
          return rejectWithValue('Сессия истекла. Войдите снова');
        }
      }
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка получения данных'
      );
    }
  }
);

//апдейт юзера
export const updateUser = createAsyncThunk(
  'auth/update',
  async (
    userData: { name: string; email: string; password?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления данных'
      );
    }
  }
);

//выход
export const clearAuthTokens = () => {
  localStorage.removeItem('refreshToken');
  document.cookie = 'accessToken=; Max-Age=0; path=/;';
};

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await logoutApi();
      clearAuthTokens();
      dispatch(logout());
      return null;
    } catch (error) {
      clearAuthTokens();
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка выхода'
      );
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInit = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    //гет данных
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isInit = true;
      state.error = action.payload as string;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isInit = true;
      state.user = action.payload;
    });

    // вход
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка входа';
    });

    // выход
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // регистрация
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
      state.isInit = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка регистрациии';
    });

    //обновление юзера
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isInit = true;
    });
  }
});

export const { init, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const selectInit = (state: RootState) => state.user.isInit;
export const selectUser = (state: RootState) => state.user.user;
