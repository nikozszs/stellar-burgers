import {
  clearCurrentOrder,
  createOrder,
  fetchAllOrders,
  fetchOrderByNumber,
  fetchOrders,
  initialState,
  orderReducer,
  resetOrderState,
  setOrderModalData
} from '../../services/slices/orderSlice';

export const mockOrder = {
  _id: '1',
  ingredients: ['ing1', 'ing2'],
  status: 'done',
  name: 'Test Burger',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  number: 12345
};

export const mockOrdersData = {
  orders: [mockOrder],
  total: 100,
  totalToday: 10
};

describe('orderSlice reducer', () => {
  test('initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });
});

describe('sync actions', () => {
  test('setOrderModalData для заказа пользователя', () => {
    const state = orderReducer(
      initialState,
      setOrderModalData({ data: mockOrdersData, type: 'user' })
    );

    expect(state.userOrders).toEqual(mockOrdersData);
  });
  test('setOrderModalData для общих заказов', () => {
    const state = orderReducer(
      initialState,
      setOrderModalData({ data: mockOrdersData, type: 'feed' })
    );

    expect(state.feedOrders).toEqual(mockOrdersData);
  });
  test('clearCurrentOrder', () => {
    const state = orderReducer(
      { ...initialState, currentOrder: mockOrder },
      clearCurrentOrder()
    );

    expect(state.currentOrder).toBeNull();
  });
  test('resetOrderState', () => {
    const state = orderReducer(
      {
        ...initialState,
        userOrders: mockOrdersData,
        feedOrders: mockOrdersData,
        currentOrder: mockOrder
      },
      resetOrderState()
    );

    expect(state).toEqual(initialState);
  });
});

describe('async actions', () => {
  describe('createOrder', () => {
    test('pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);
      expect(state.orderRequest).toBe(true);
    });
    test('fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.userOrders.total).toBe(1);
      expect(state.userOrders.totalToday).toBe(1);
      expect(state.orderRequest).toBe(false);
    });
    test('rejected', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: 'Error'
      };
      const state = orderReducer(initialState, action);
      expect(state.error).toBe('Error');
      expect(state.orderRequest).toBe(false);
    });
  });

  describe('fetchAllOrders', () => {
    test('fulfilled', () => {
      const action = {
        type: fetchAllOrders.fulfilled.type,
        payload: mockOrdersData
      };
      const state = orderReducer(initialState, action);
      expect(state.feedOrders).toEqual(mockOrdersData);
      expect(state.feedError).toBeNull();
    });
    test('rejected', () => {
      const action = {
        type: fetchAllOrders.rejected.type,
        payload: 'Feed error'
      };
      const state = orderReducer(initialState, action);
      expect(state.feedError).toBe('Feed error');
    });
  });

  describe('fetchOrders', () => {
    test('fulfilled', () => {
      const action = {
        type: fetchOrders.fulfilled.type,
        payload: mockOrdersData
      };
      const state = orderReducer(initialState, action);
      expect(state.userOrders).toEqual(mockOrdersData);
      expect(state.error).toBeNull();
    });
    test('rejected', () => {
      const action = {
        type: fetchOrders.rejected.type,
        payload: 'User orders error'
      };
      const state = orderReducer(initialState, action);
      expect(state.error).toBe('User orders error');
    });
  });

  describe('fetchOrderByNumber', () => {
    test('pending', () => {
      const state = orderReducer(
        { ...initialState, currentOrder: mockOrder },
        { type: fetchOrderByNumber.pending.type }
      );
      expect(state.currentOrder).toBeNull();
    });
    test('fulfilled', () => {
      const action = {
        type: fetchOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);
      expect(state.currentOrder).toEqual(mockOrder);
    });
  });
});
