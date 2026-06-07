import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { AlertType } from "../types/common";
import { showAlert } from "./CommonSlice";

export type AdminState = {
  admin: any;
};

const initialState: AdminState = {
  admin: null,
};
export const loginAdmin = createAsyncThunk<
  { token: string; user: any },
  { password: string; name: string; email: string }
>("admin/login", async (userData, { dispatch, rejectWithValue }) => {
  try {
    if (
      userData.email !== "admin@gmail.com" ||
      userData.password !== "123456"
    ) {
      throw new Error("Неверные учетные данные");
    }

    const user = {
      username: userData.name,
      email: userData.email,
      phone: "",
      address: "",
      isVerified: true,
    };

    localStorage.setItem("token", "admin-token");
    localStorage.setItem("user", JSON.stringify(user));

    dispatch(
      showAlert({
        type: AlertType.Success,
        message: "Вход в админку выполнен успешно!",
      }),
    );

    return { token: "admin-token", user };
  } catch (error: any) {
    dispatch(
      showAlert({
        type: AlertType.Error,
        message: error.message || "Ошибка входа",
      }),
    );
    return rejectWithValue(error.message || "Ошибка входа");
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
