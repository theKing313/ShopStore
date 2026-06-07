import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import { Alert, AlertType, CartItem, Error, Order } from "../types/common";
import { handleObj, wait } from "../utils/helpers";
import { CREATE_ORDER_ERROR_MESSAGE } from "../constants/messages";
import MOCKED_COMMON from "../mocks/common.json";

export type CommonState = {
  alert: Alert;
  orders: Order[];
  isLoading: boolean;
  error: Error;
};

const initialState: CommonState = {
  alert: {
    type: AlertType.Info,
    message: "",
  },
  orders: [],
  isLoading: false,
  error: {
    isError: false,
    message: "",
  },
};
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5044";
// new row violates row-level security policy

export const fetchOrders = createAsyncThunk(
  "common/fetchOrders",
  async (_, { dispatch, rejectWithValue }) => {
    // const response = await fetch(`${BASE_URL}/orders.json`);
    // const orders: Order[] = handleObj(MOCKED_COMMON as any);
    // console.log("orders", orders);
    // return orders;
    // const orders: Order[] = handleObj(data);
    // if (!response.ok) {
    //   dispatch(
    //     showAlert({
    //       type: AlertType.Error,
    //       message: FETCH_ORDERS_ERROR_MESSAGE,
    //     }),
    //   );
    //   return rejectWithValue(FETCH_ORDERS_ERROR_MESSAGE);
    // }

    const response = await fetch(`${BASE_URL}/api/orders`);
    if (!response.ok) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: CREATE_ORDER_ERROR_MESSAGE,
        }),
      );
      return rejectWithValue(CREATE_ORDER_ERROR_MESSAGE);
    }
    const data = await response.json();
    console.log("Orders fetched from API:", data);
    console.log("Orders fetched from API (stringified):", JSON.stringify(data));
    console.log(BASE_URL);
    const brands: Order[] = handleObj(data);
    return brands;
  },
);

export type OrderResponse = Order & { paymentUrl?: string };

export const createOrder = createAsyncThunk(
  "common/createOrder",
  async (
    order: Partial<Omit<Order, "cart">> & { cart: CartItem[] },
    { dispatch, rejectWithValue },
  ) => {
    try {
      console.log("order------------------------", order);
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        dispatch(
          showAlert({
            type: AlertType.Error,
            message: CREATE_ORDER_ERROR_MESSAGE,
          }),
        );
        return rejectWithValue(CREATE_ORDER_ERROR_MESSAGE);
      }

      const data = await response.json();
      return data as OrderResponse;
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: CREATE_ORDER_ERROR_MESSAGE,
        }),
      );
      return rejectWithValue(CREATE_ORDER_ERROR_MESSAGE);
    }
  },
);

export const showAlert = createAsyncThunk(
  "common/handleAlert",
  async (alert: Alert, { dispatch }) => {
    dispatch(setAlert(alert));
    await wait(2500);
    dispatch(hideAlert());
  },
);

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setAlert: (state, action: PayloadAction<Alert>) => {
      state.alert = action.payload;
    },

    hideAlert: (state) => {
      state.alert = initialState.alert;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(fetchOrders.fulfilled, (state, { payload }) => {
      state.orders = payload;
      state.isLoading = false;
    });

    builder.addCase(fetchOrders.rejected, (state, { payload }) => {
      state.error = {
        isError: true,
        message: payload as Error["message"],
      };
      state.isLoading = false;
    });

    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createOrder.fulfilled, (state, { payload }) => {
      state.isLoading = false;
    });

    builder.addCase(createOrder.rejected, (state, { payload }) => {
      state.error = {
        isError: true,
        message: payload as Error["message"],
      };
      state.isLoading = false;
    });
  },
});

export const { setAlert, hideAlert } = commonSlice.actions;

export default commonSlice.reducer;
