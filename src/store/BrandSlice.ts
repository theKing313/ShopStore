import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Brand, Error } from "../types/common";
import {
  CREATE_BRAND_ERROR_MESSAGE,
  DELETE_BRAND_ERROR_MESSAGE,
  FETCH_BRANDS_ERROR_MESSAGE,
  UPDATE_BRAND_ERROR_MESSAGE,
} from "../constants/messages";

const BASE_URL =
  process.env.VITE_API_URL || "https://backendstore-9jt0.onrender.com";

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/brands`);
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || FETCH_BRANDS_ERROR_MESSAGE);
      }
      const brands = await response.json();
      return brands as Brand[];
    } catch (error) {
      return rejectWithValue(FETCH_BRANDS_ERROR_MESSAGE);
    }
  },
);

export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (brand: Partial<Brand>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/brands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brand),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || CREATE_BRAND_ERROR_MESSAGE);
      }
      const createdBrand = await response.json();
      return createdBrand as Brand;
    } catch (error) {
      return rejectWithValue(CREATE_BRAND_ERROR_MESSAGE);
    }
  },
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async (brand: Brand, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/brands/${brand.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brand),
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || UPDATE_BRAND_ERROR_MESSAGE);
      }
      const updatedBrand = await response.json();
      return updatedBrand as Brand;
    } catch (error) {
      return rejectWithValue(UPDATE_BRAND_ERROR_MESSAGE);
    }
  },
);

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (id: Brand["id"], { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/brands/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || DELETE_BRAND_ERROR_MESSAGE);
      }
      return id;
    } catch (error) {
      return rejectWithValue(DELETE_BRAND_ERROR_MESSAGE);
    }
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
