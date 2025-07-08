// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { getToken, getUser } from '../../api/user';
// import { User } from '../../types';

// export const loginUserThunk = createAsyncThunk(
//     'users/loginUser',
//     ({login, password}: {login: string; password: string}) =>
//         getToken({login, password})
//             .then(token => {
//                 localStorage.setItem('token', token);
//                 return token;
//             }),
// )

// export const getUserThunk = createAsyncThunk(
//     'users/getUser',
//     ({token}: {token: string}) =>
//         getUser({token}),
// )

// export interface UserState {
//     isInit: boolean;
//     isLoading: boolean;
//     user: User | null;
//     error: string | null;
// }

// const initialState: UserState = {
//     isInit: false,
//     isLoading: false,
//     user: null,
//     error: null,
// }

// export const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         init: (state) => {
//             state.isInit = true;
//         },
//         logout: (state) => {
//             // Очищаем состояние пользователя
//             state.user = null;
//             // Удаляем токен из localStorage
//             localStorage.removeItem('token');
//         }
//     },
//     extraReducers: (builder) => {
        
//         builder.addCase(loginUserThunk.pending, (state) => {
//             state.isLoading = true;
//         });
//         builder.addCase(loginUserThunk.rejected, (state) => {
//             state.isLoading = false;
//         });
//         builder.addCase(loginUserThunk.fulfilled, (state) => {
//             state.isLoading = false;
//         });

//         builder.addCase(getUserThunk.pending, (state) => {
//             state.isLoading = true;
//         });
//         builder.addCase(getUserThunk.rejected, (state) => {
//             state.isInit = true;
//             state.isLoading = false;
//         });
//         builder.addCase(getUserThunk.fulfilled, (state, {payload}) => {
//             state.isInit = true;
//             state.isLoading = false;
//             state.user = payload;
//         });
//     }
// });

// export const {init} = userSlice.actions;

// export default userSlice.reducer