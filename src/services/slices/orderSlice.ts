import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData, TOrderState } from '@utils-types';

export const initialState: TOrderState = {
  userOrders: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  feedOrders: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  currentOrder: null,
  orderRequest: false,
  error: null,
  feedError: null
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
  'orders/fetchUser',
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

// получение заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при загрузке заказа'
      );
    }
  }
);

//публичная лента
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки ленты заказов'
      );
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    selectUserOrders: (state) => state.userOrders,
    selectTotal: (state) => state.feedOrders.total,
    selectTotalToday: (state) => state.feedOrders.totalToday,
    selectFeedOrders: (state) => state.feedOrders,
    selectCurrentOrder: (state) => state.currentOrder,
    selectOrderRequest: (state) => state.orderRequest,
    selectUserError: (state) => state.error,
    selectFeedError: (state) => state.feedError,
    selectOrderData: (state) => ({
      userOrders: state.userOrders,
      feedOrders: state.feedOrders,
      currentOrder: state.currentOrder,
      orderRequest: state.orderRequest,
      error: state.error,
      feedError: state.feedError
    })
  },
  reducers: {
    setOrderModalData: (
      state,
      action: PayloadAction<{ data: TOrdersData; type: 'user' | 'feed' }>
    ) => {
      if (action.payload.type === 'user') {
        state.userOrders = action.payload.data;
      } else {
        state.feedOrders = action.payload.data;
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    resetOrderState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.userOrders.total += 1;
        state.userOrders.totalToday += 1;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      })
      // Обработка публичной ленты
      .addCase(fetchAllOrders.pending, (state) => {
        state.feedError = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.feedOrders.orders = action.payload.orders;
        state.feedOrders.total = action.payload.total;
        state.feedOrders.totalToday = action.payload.totalToday;
        state.feedError = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.feedError = action.payload as string;
      })

      // Обработка личных заказов
      .addCase(fetchOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.userOrders.orders = action.payload.orders;
        state.userOrders.total = action.payload.total;
        state.userOrders.totalToday = action.payload.totalToday;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  }
});

export const { setOrderModalData, clearCurrentOrder, resetOrderState } =
  orderSlice.actions;

export const orderReducer = orderSlice.reducer;
export const {
  selectUserOrders,
  selectFeedOrders,
  selectCurrentOrder,
  selectOrderRequest,
  selectUserError,
  selectFeedError,
  selectOrderData,
  selectTotal,
  selectTotalToday
} = orderSlice.selectors;
