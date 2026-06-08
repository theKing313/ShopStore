import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import { Category, Error } from "../types/common";
import {
  CREATE_CATEGORY_ERROR_MESSAGE,
  DELETE_CATEGORY_ERROR_MESSAGE,
  FETCH_CATEGORIES_ERROR_MESSAGE,
  UPDATE_CATEGORY_ERROR_MESSAGE,
} from "../constants/messages";

const BASE_URL =
  process.env.VITE_API_URL || "https://backendstore-9jt0.onrender.com";

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || FETCH_CATEGORIES_ERROR_MESSAGE);
      }
      const categories = await response.json();
      return categories as Category[];
    } catch (error) {
      return rejectWithValue(FETCH_CATEGORIES_ERROR_MESSAGE);
    }
  },
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category: Partial<Category>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || CREATE_CATEGORY_ERROR_MESSAGE);
      }
      const createdCategory = await response.json();
      return createdCategory as Category;
    } catch (error) {
      return rejectWithValue(CREATE_CATEGORY_ERROR_MESSAGE);
    }
  },
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (category: Category, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/categories/${category.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        },
      );
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || UPDATE_CATEGORY_ERROR_MESSAGE);
      }
      const updatedCategory = await response.json();
      return updatedCategory as Category;
    } catch (error) {
      return rejectWithValue(UPDATE_CATEGORY_ERROR_MESSAGE);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id: Category["id"], { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || DELETE_CATEGORY_ERROR_MESSAGE);
      }
      return id;
    } catch (error) {
      return rejectWithValue(DELETE_CATEGORY_ERROR_MESSAGE);
    }
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
