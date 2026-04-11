import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AlertType, Brand, Error } from "../types/common";
import { handleObj } from "../utils/helpers";
import {
  CREATE_BRAND_ERROR_MESSAGE,
  DELETE_BRAND_ERROR_MESSAGE,
  FETCH_BRANDS_ERROR_MESSAGE,
  UPDATE_BRAND_ERROR_MESSAGE,
} from "../constants/messages";
import { showAlert } from "./CommonSlice";
import MOCK_BRANDS from "../mocks/brands.json";

export type BrandState = {
  brands: Brand[];
  selectedBrand: Brand;
  isLoading: boolean;
  error: Error;
};

const initialState: BrandState = {
  brands: [],
  selectedBrand: {
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

export const fetchBrands = createAsyncThunk(
  "brand/fetchbrands",
  async (_, { dispatch }) => {
    // Упрощенная версия: используем локальные данные
    const brands: Brand[] = handleObj(MOCK_BRANDS);
    return brands;
  },
);

export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (brand: Partial<Brand>, { dispatch }) => {
    // Упрощенная версия: генерируем id
    const id = Date.now().toString();
    return { id, ...brand } as Brand;
  },
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async (brand: Brand, { dispatch }) => {
    // Упрощенная версия: возвращаем обновленный
    return brand;
  },
);

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (id: Brand["id"], { dispatch }) => {
    // Упрощенная версия: возвращаем id
    return id;
  },
);

export const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    selectBrand: (state, action: PayloadAction<Brand["id"]>) => {
      const brand = state.brands.find((brand) => brand.id === action.payload);

      if (!brand) return;

      state.selectedBrand = brand;
    },

    removeSelectedBrand: (state) => {
      state.selectedBrand = initialState.selectedBrand;
    },

    resetBrandError: (state) => {},
  },

  extraReducers: (builder) => {
    builder.addCase(fetchBrands.fulfilled, (state, { payload }) => {
      state.brands = payload;
      state.isLoading = false;
    });

    builder.addCase(createBrand.fulfilled, (state, { payload }) => {
      state.brands.push(payload);
      state.isLoading = false;
    });

    builder.addCase(updateBrand.fulfilled, (state, { payload }) => {
      const index = state.brands.findIndex((brand) => brand.id === payload.id);
      if (index < 0) return;
      state.brands[index] = payload;
      state.isLoading = false;
    });

    builder.addCase(deleteBrand.fulfilled, (state, { payload }) => {
      const index = state.brands.findIndex((brand) => brand.id === payload);
      state.brands.splice(index, 1);
      state.isLoading = false;
    });
  },
});

export const { selectBrand, removeSelectedBrand, resetBrandError } =
  brandSlice.actions;

export default brandSlice.reducer;
