import { getUser, init, initialState, loginUser, logout, logoutUser, registerUser, updateUser, userReducer } from "../../services/slices/userSlice";

export const mockUser = {
    name: 'Test User',
    email: 'test@example.com'
};

describe('userSlice  reducer', () => {
    test('initial state', () => {
        expect(userReducer(undefined, { type: 'unknown' }))
        .toEqual(initialState);
    });
})

describe('sync actions', () => {
    test('init', () => {
        const state = userReducer(initialState, init());
        expect(state.isInit).toBe(true);
    });
    test('logout', () => {
        const state = userReducer(
            { ...initialState, user: mockUser }, 
            logout()
        );
        expect(state.user).toBeNull();
    });
});

describe('async actions', () => {
    describe('registerUser', () => {
        test('pending', () => {
            const action = { type: registerUser.pending.type };
            const state = userReducer(initialState, action);
            expect(state.isLoading).toBe(true);
        });
        test('fulfilled', () => {
            const action = { 
                type: registerUser.fulfilled.type,
                payload: mockUser
            };
            const state = userReducer(initialState, action);
            expect(state.user).toEqual(mockUser);
            expect(state.isLoading).toBe(false);
            expect(state.isInit).toBe(true);
        });
        test('rejected', () => {
            const action = { 
                type: registerUser.rejected.type,
                error: { message: 'Error' }
            };
            const state = userReducer(initialState, action);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBe('Error');
        });
    });

    describe('loginUser', () => {
        test('pending', () => {
            const action = { type: loginUser.pending.type };
            const state = userReducer(initialState, action);
            expect(state.isLoading).toBe(true);
        })
        test('fulfilled', () => {
            const action = { 
                type: loginUser.fulfilled.type,
                payload: mockUser
            };
            const state = userReducer(initialState, action);
            expect(state.user).toEqual(mockUser);
            expect(state.isLoading).toBe(false);
        })
        test('rejected', () => {
            const action = { 
                type: loginUser.rejected.type,
                error: { message: 'Login failed' }
            };
            const state = userReducer(initialState, action);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBe('Login failed');
        });
    });

    describe('getUser', () => {
        test('pending', () => {
            const action = { type: getUser.pending.type };
            const state = userReducer(initialState, action);
            expect(state.isLoading).toBe(true);
        })
        test('fulfilled', () => {
            const action = { 
                type: getUser.fulfilled.type,
                payload: mockUser
            };
            const state = userReducer(initialState, action);
            expect(state.user).toEqual(mockUser);
            expect(state.isLoading).toBe(false);
            expect(state.isInit).toBe(true);
        })
        test('rejected', () => {
            const action = { 
                type: getUser.rejected.type,
                payload: 'Session expired'
            };
            const state = userReducer(initialState, action);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBe('Session expired');
            expect(state.isInit).toBe(true);
        });
    });
    describe('updateUser', () => {
        test('pending', () => {
            const action = { type: updateUser.pending.type };
            const state = userReducer(initialState, action);
            expect(state.isLoading).toBe(true);
        })
        test('fulfilled', () => {
            const updatedUser = { ...mockUser, name: 'New Name' };
            const action = { 
                type: updateUser.fulfilled.type,
                payload: updatedUser
            };
            const state = userReducer({ ...initialState, user: mockUser }, action);
            expect(state.user).toEqual(updatedUser);
            expect(state.isLoading).toBe(false);
        })
        test('rejected', () => {
            const action = { 
                type: updateUser.rejected.type,
                payload: 'Update failed'
            };
            const state = userReducer(initialState, action);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBe('Update failed');
        });
    });
    describe('logoutUser', () => {
        test('fulfilled', () => {
            const action = { 
                type: logoutUser.fulfilled.type
            };
            const state = userReducer({ ...initialState, user: mockUser }, action);
            expect(state.user).toBeNull();
            expect(state.isLoading).toBe(false);
        })
        test('rejected', () => {
            const action = { 
                type: logoutUser.rejected.type,
                payload: 'Logout failed'
            };
            const state = userReducer(initialState, action);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBe('Logout failed');
        });
    });
})