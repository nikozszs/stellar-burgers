import { getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData, TOrderState } from '@utils-types';

export const initialState: TOrderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null,
  orderRequest: false,
  error: null
};

// Создание заказа из конструктора
export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось создать созданный Вами заказ'
      );
    }
  }
);

// Получение списка заказов
export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Ошибка при загрузке ленты заказов'
      );
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    selectOrders: (state) => state.orders,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectCurrentOrder: (state) => state.currentOrder,
    selectOrderRequest: (state) => state.orderRequest,
    selectError: (state) => state.error,
    selectOrderData: (state) => ({
      orders: state.orders,
      total: state.total,
      totalToday: state.totalToday,
      currentOrder: state.currentOrder,
      orderRequest: state.orderRequest,
      error: state.error
    })
  },
  reducers: {
    setOrderModalData: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.total += 1;
        state.totalToday += 1;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const { setOrderModalData, clearCurrentOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
export const {
  selectOrders,
  selectTotal,
  selectTotalToday,
  selectCurrentOrder,
  selectOrderRequest,
  selectError,
  selectOrderData
} = orderSlice.selectors;
