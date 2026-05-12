import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import { AlertType, CartItem, Product } from "../types/common";
import { RootState } from "./store";
import { showAlert } from "./CommonSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export type AdminState = {
  admin: any;
};

const initialState: AdminState = {
  admin: null,
};
export const loginAdmin = createAsyncThunk<
  { user: any; password: string },
  { password: string; name: string; email: string }
>("admin/login", async (userData, { dispatch, rejectWithValue }) => {
  try {
    // const response = await axios.post(
    //   `${API_URL}/api/login`,
    //   userData,
    // );
    if (userData.email !== "admin@gmail.com" || userData.password !== "1234") {
      throw new Error("Неверные учетные данные");
    } else {
      // const result = response.data; // { token, user }
      // localStorage.setItem("token", result.token);
      localStorage.setItem("admin", JSON.stringify(userData.name));
    }
    dispatch(
      showAlert({
        type: AlertType.Success,
        message: "Вход выполнен успешно!",
      }),
    );
    return { user: userData.name, password: userData.password };
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
export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
      localStorage.setItem("admin", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.admin = action.payload.user;
    });
  },
});

export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;
