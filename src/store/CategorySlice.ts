import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import { AlertType, Category, Error } from "../types/common";
import { handleObj } from "../utils/helpers";
import {
  CREATE_CATEGORY_ERROR_MESSAGE,
  DELETE_CATEGORY_ERROR_MESSAGE,
  FETCH_CATEGORIES_ERROR_MESSAGE,
  UPDATE_CATEGORY_ERROR_MESSAGE,
} from "../constants/messages";
import { showAlert } from "./CommonSlice";
import MOCKED_CATEGORIES from "../mocks/categories.json";

export type CategoryState = {
  categories: Category[];
  selectedCategory: Category;
  isLoading: boolean;
  error: Error;
};

const initialState: CategoryState = {
  categories: [],
  selectedCategory: {
    id: "",
    name: "",
    description: "",
    url: "",
  },
  isLoading: false,
  error: {
    isError: false,
    message: "",
  },
};

// const BASE_URL = 'https://e-commerce-65446-default-rtdb.firebaseio.com';

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { dispatch }) => {
    // Упрощенная версия: используем локальные данные
    const categories: Category[] = handleObj(MOCKED_CATEGORIES);
    return categories;
  },
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category: Partial<Category>, { dispatch }) => {
    // Упрощенная версия: генерируем id
    const id = Date.now().toString();
    return { id, ...category } as Category;
  },
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (category: Category, { dispatch }) => {
    // Упрощенная версия: возвращаем обновленный
    return category;
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id: Category["id"], { dispatch }) => {
    // Упрощенная версия: возвращаем id
    return id;
  },
);

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    selectCategory: (state, action: PayloadAction<Category["id"]>) => {
      const category = state.categories.find(
        (category) => category.id === action.payload,
      );

      if (!category) return;

      state.selectedCategory = category;
    },

    removeSelectedCategory: (state) => {
      state.selectedCategory = initialState.selectedCategory;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, { payload }) => {
      state.categories = payload;
      state.isLoading = false;
    });

    builder.addCase(createCategory.fulfilled, (state, { payload }) => {
      state.categories.push(payload);
      state.isLoading = false;
    });

    builder.addCase(updateCategory.fulfilled, (state, { payload }) => {
      const index = state.categories.findIndex(
        (category) => category.id === payload.id,
      );
      if (index < 0) return;
      state.categories[index] = payload;
      state.isLoading = false;
    });

    builder.addCase(deleteCategory.fulfilled, (state, { payload }) => {
      const index = state.categories.findIndex(
        (category) => category.id === payload,
      );
      state.categories.splice(index, 1);
      state.isLoading = false;
    });
  },
});

export const { selectCategory, removeSelectedCategory } = categorySlice.actions;

export default categorySlice.reducer;
