import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { PayloadAction } from "@reduxjs/toolkit";
import { AlertType, CartItem, Product, user } from "../types/common";
import { RootState } from "./store";
import { showAlert } from "./CommonSlice";

const API_URL =
  process.env.REACT_APP_API_URL || "https://backendstore-9jt0.onrender.com";

type WishList = Product["id"][];

export type UserState = {
  user: user | null;
  token: string | null;
  loading: boolean;
};

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
};
export const logOut = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(
      showAlert({
        type: AlertType.Info,
        message: "Вы вышли из аккаунта",
      }),
    );
  },
);
export const authUser = createAsyncThunk<
  string,
  { username: string; email: string; password: string }
>("user/auth", async (userData, { dispatch, rejectWithValue }) => {
  try {
    console.log(API_URL);
    alert(API_URL);
    alert(process.env.REACT_APP_API_URL);
    const response = await axios.post(`${API_URL}/api/registration`, userData);
    const token = response.data.token;
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

export const loginUser = createAsyncThunk<
  { token: string; user: any },
  { email: string; password: string }
>("user/login", async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, userData);
    const result = response.data; // { token, user }
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    dispatch(
      showAlert({
        type: AlertType.Success,
        message: "Вход выполнен успешно!",
      }),
    );
    return result;
  } catch (error: any) {
    dispatch(
      showAlert({
        type: AlertType.Error,
        // Выводим конкретное сообщение от сервера, если оно пришло, иначе стандартное
        message: typeof error === "string" ? error : "Ошибка входа",
      }),
    );
    return rejectWithValue(error || "Ошибка входа");
  }
});

export const sendCode = createAsyncThunk<void, string>(
  "auth/sendCode",
  async (email, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/send-code`, {
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

export const sendResetCode = createAsyncThunk<void, string>(
  "auth/sendResetCode",
  async (email, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/password-reset/request`,
        { email },
      );
      dispatch(
        showAlert({
          type: AlertType.Success,
          message: response.data.message || "Код для сброса пароля отправлен",
        }),
      );
    } catch (error: any) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            error.response?.data?.message ||
            JSON.stringify(error.response?.data) ||
            "Ошибка отправки кода для сброса пароля",
        }),
      );
      return rejectWithValue(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Ошибка отправки кода для сброса пароля",
      );
    }
  },
);

export const resetPassword = createAsyncThunk<
  void,
  { email: string; code: string; password: string }
>("auth/resetPassword", async (data, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/password-reset/confirm`,
      data,
    );
    dispatch(
      showAlert({
        type: AlertType.Success,
        message: response.data.message || "Пароль успешно сброшен",
      }),
    );
  } catch (error: any) {
    dispatch(
      showAlert({
        type: AlertType.Error,
        message:
          error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Ошибка сброса пароля",
      }),
    );
    return rejectWithValue(
      error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Ошибка сброса пароля",
    );
  }
});

export const verifyCode = createAsyncThunk<
  { token: string; user: any; message: string },
  { email: string; code: string; username: string; password: string }
>("auth/verifyCode", async (data, { dispatch, rejectWithValue }) => {
  alert(JSON.stringify(data));
  try {
    const response = await axios.post(`${API_URL}/api/verify-code`, data);
    const result = response.data; // { token, user, message }
    localStorage.setItem("token", JSON.stringify(result.token));
    localStorage.setItem("user", JSON.stringify(result.user));
    dispatch(
      showAlert({
        type: AlertType.Success,
        message: result.message || "Проверка кода прошла успешно",
      }),
    );
    return result?.success ? result : rejectWithValue(result);
  } catch (error: any) {
    dispatch(
      showAlert({
        type: AlertType.Error,
        message: error.response?.data?.message || "Ошибка верификации",
      }),
    );
    return rejectWithValue(error.response?.data || "Ошибка верификации");
  }
  // Заглушка для успешной верификации
  // return new Promise<{ token: string; user: any; message: string }>(
  //   (resolve) => {
  //     setTimeout(() => {
  //       const fakeResult = {
  //         token: "fake-jwt-token",
  //         user: { id: 1, email: data.email, username: data.username },
  //         message: "Регистрация успешна!",
  //       };
  //       localStorage.setItem("token", fakeResult.token);
  //       localStorage.setItem("user", JSON.stringify(fakeResult.user));
  //       dispatch(
  //         showAlert({
  //           type: AlertType.Success,
  //           message: fakeResult.message,
  //         }),
  //       );
  //       resolve(fakeResult);
  //     }, 1000);
  //   },
  // );
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
    //   const response = await axios.get(`${API_URL}/api/verify-token`, {
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
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
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
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.token = null;
        state.user = null;
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
      })
      .addCase(logOut.fulfilled, (state) => {
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;
