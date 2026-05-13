import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AlertType, Error, Product } from "../types/common";
import { handleObj } from "../utils/helpers";
import { RootState } from "./store";
import {
  CREATE_PRODUCT_ERROR_MESSAGE,
  DELETE_PRODUCT_ERROR_MESSAGE,
  FETCH_PRODUCTS_ERROR_MESSAGE,
  UPDATE_PRODUCT_ERROR_MESSAGE,
} from "../constants/messages";
import { fetchBrands } from "./BrandSlice";
import { fetchCategories } from "./CategorySlice";
import { showAlert } from "./CommonSlice";
import MOCKED_PRODUCTS from "../mocks/products.json";

export type ProductState = {
  products: Product[];
  selectedProduct: Product;
  isLoading: boolean;
  error: Error;
};

const initialState: ProductState = {
  products: [],
  selectedProduct: {
    id: "",
    category: {
      id: "",
      name: "",
      url: "",
    },
    description: "",
    image: "",
    name: "",
    price: 0,
    weight: 0,
    brand: {
      id: "",
      name: "",
    },
    gender: {
      name: "",
      id: "",
      url: "",
    },
  },
  isLoading: false,
  error: {
    isError: false,
    message: "",
  },
};

// const BASE_URL = "https://e-commerce-65446-default-rtdb.firebaseio.com";

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("product/fetchProducts", async (_, { getState, dispatch }) => {
  // Упрощенная версия: всегда используем локальные данные
  await Promise.all([dispatch(fetchBrands()), dispatch(fetchCategories())]);
  if (localStorage.getItem("products")) {
    const productsFromStorage = JSON.parse(
      localStorage.getItem("products") || "[]",
    ) as Product[];
    return productsFromStorage;
  } else {
    let products: Product[] = handleObj(MOCKED_PRODUCTS);
    localStorage.setItem("products", JSON.stringify(products));
    const {
      brand: { brands },
      category: { categories },
    } = getState();

    const productsWithUpdatedBrandsAndCategories = products.map((product) => {
      const category = categories.find(
        (category) => category.id === product.category.id,
      );
      const brand = brands.find((brand) => brand.id === product.brand.id);

      if (!category && !brand) {
        return product;
      }

      return {
        ...product,
        category: {
          ...category,
          name: category && category.name,
        },
        brand: {
          ...brand,
          name: brand && brand.name,
        },
      };
    }) as Product[];

    return productsWithUpdatedBrandsAndCategories;
  }
});

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (product: Partial<Product>, { dispatch }) => {
    // Упрощенная версия: генерируем id и возвращаем
    const id = Date.now().toString(); // Простой id
    const newProduct = { id, ...product } as Product;
    return newProduct;
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (product: Product, { dispatch }) => {
    // Упрощенная версия: просто возвращаем обновленный продукт
    return product;
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id: Product["id"], { dispatch }) => {
    // Упрощенная версия: просто возвращаем id для удаления
    return id;
  },
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    selectProduct: (state, action: PayloadAction<Product["id"]>) => {
      const product = state.products.find(
        (product) => product.id === action.payload,
      );

      if (!product) return;

      state.selectedProduct = product;
    },

    removeSelectedProduct: (state) => {
      state.selectedProduct = initialState.selectedProduct;
    },

    updateAllProductsBrands: (
      state,
      action: PayloadAction<Product["brand"]>,
    ) => {
      state.products = state.products.map((product) => {
        if (product.brand.id === action.payload.id) {
          return {
            ...product,
            brand: action.payload,
          };
        }
        return product;
      });
    },

    updateAllProductsCategories: (
      state,
      action: PayloadAction<Product["category"]>,
    ) => {
      state.products = state.products.map((product) => {
        if (product.category.id === action.payload.id) {
          return {
            ...product,
            category: action.payload,
          };
        }
        return product;
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
      state.products = payload;
      state.isLoading = false;
    });

    builder.addCase(createProduct.fulfilled, (state, { payload }) => {
      state.products.push(payload);
      state.isLoading = false;
    });

    builder.addCase(updateProduct.fulfilled, (state, { payload }) => {
      const index = state.products.findIndex(
        (product) => product.id === payload.id,
      );
      if (index < 0) return;
      state.products[index] = payload;
      localStorage.setItem("products", JSON.stringify(state.products));
      state.isLoading = false;
    });

    builder.addCase(deleteProduct.fulfilled, (state, { payload }) => {
      const index = state.products.findIndex(
        (product) => product.id === payload,
      );
      state.products.splice(index, 1);
      state.isLoading = false;
    });
  },
});

export const {
  selectProduct,
  removeSelectedProduct,
  updateAllProductsCategories,
  updateAllProductsBrands,
} = productSlice.actions;

export default productSlice.reducer;
