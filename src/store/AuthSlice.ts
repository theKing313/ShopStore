import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { PayloadAction } from "@reduxjs/toolkit";
import { AlertType, CartItem, Product, user } from "../types/common";
import { RootState } from "./store";
import { showAlert } from "./CommonSlice";
import {
  ADDED_TO_WISHLIST,
  REMOVED_FROM_WISHLIST,
} from "../constants/messages";

type WishList = Product["id"][];

export type UserState = {
  user: user | null;
  token: string | null;
};

const initialState: UserState = {
  user: null,
  token: null,
};

export const authUser = createAsyncThunk<
  string,
  { name: string; email: string; password: string }
>("user/auth", async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post("http://localhost:5044/auth", userData);
    const token = response.data.token; // Предполагаем, что сервер возвращает { token: "..." }
    localStorage.setItem("token", token);
    dispatch(
      showAlert({
        type: AlertType.Success,
        message: "User authenticated successfully!",
      }),
    );
    return token;
  } catch (error: any) {
    dispatch(
      showAlert({
        type: AlertType.Error,
        message: error.response?.data?.message || "Authentication failed",
      }),
    );
    return rejectWithValue(error.response?.data || "Authentication failed");
  }
});

export const sendCode = createAsyncThunk<void, string>(
  "auth/sendCode",
  async (email, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5044/api/send-code", {
        email,
      });
      dispatch(
        showAlert({
          type: AlertType.Success,
          message: "Код отправлен на email!",
        }),
      );
    } catch (error: any) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            JSON.stringify(error.response?.data) || "Ошибка отправки кода",
        }),
      );
      return rejectWithValue(
        JSON.stringify(error.response?.data) || "Ошибка отправки кода",
      );
    }
  },
);

export const verifyCode = createAsyncThunk<
  { token: string; user: any; message: string },
  { email: string; code: string; username: string; password: string }
>("auth/verifyCode", async (data, { dispatch, rejectWithValue }) => {
  // try {
  //   const response = await axios.post(
  //     "http://localhost:5044/api/verify-code",
  //     data,
  //   );
  //   const result = response.data; // { token, user, message }
  //   localStorage.setItem("token", result.token);
  //   dispatch(
  //     showAlert({
  //       type: AlertType.Success,
  //       message: result.message,
  //     }),
  //   );
  //   return result;
  // } catch (error: any) {
  //   dispatch(
  //     showAlert({
  //       type: AlertType.Error,
  //       message: error.response?.data?.message || "Ошибка верификации",
  //     }),
  //   );
  //   return rejectWithValue(error.response?.data || "Ошибка верификации");
  // }

  // Заглушка для успешной верификации
  return new Promise<{ token: string; user: any; message: string }>(
    (resolve) => {
      setTimeout(() => {
        const fakeResult = {
          token: "fake-jwt-token",
          user: { id: 1, email: data.email, username: data.username },
          message: "Регистрация успешна!",
        };
        localStorage.setItem("token", fakeResult.token);
        localStorage.setItem("user", JSON.stringify(fakeResult.user));
        dispatch(
          showAlert({
            type: AlertType.Success,
            message: fakeResult.message,
          }),
        );
        resolve(fakeResult);
      }, 1000);
    },
  );
});

export const checkAuth = createAsyncThunk<{ token: string; user: any }, void>(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token");
    }

    // Имитация проверки токена (заглушка)
    return new Promise<{ token: string; user: any }>((resolve) => {
      setTimeout(() => {
        const fakeUser = localStorage.getItem("user");
        resolve({ token, user: fakeUser ? JSON.parse(fakeUser) : null });
      }, 500);
    });

    // Для реального бэкенда:
    // try {
    //   const response = await axios.get("http://localhost:5044/api/verify-token", {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   return { token, user: response.data.user };
    // } catch (error) {
    //   localStorage.removeItem("token");
    //   return rejectWithValue("Invalid token");
    // }
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authUser.pending, (state) => {
        // Можно добавить loading state если нужно
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(authUser.rejected, (state) => {
        state.token = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(verifyCode.rejected, (state) => {
        state.token = null;
        state.user = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.token = null;
        state.user = null;
        localStorage.removeItem("token");
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
