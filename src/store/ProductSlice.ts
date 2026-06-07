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
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5044";
// const BASE_URL = "http://localhost:5044";
console.log("ProductSlice BASE_URL:", BASE_URL);
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
    // let products: Product[] = handleObj(MOCKED_PRODUCTS);
    // localStorage.setItem("products", JSON.stringify(products));
    console.log("Fetching products from API...", BASE_URL);
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const apiProducts = await response.json();
    console.log("Products fetched from API:", apiProducts);
    const products: Product[] = apiProducts.map((product: any) => {
      const discountFromApi =
        product.discount ??
        (product.discountPercent != null
          ? {
              percent: product.discountPercent,
              discountedPrice:
                product.discountedPrice ??
                Math.round(
                  product.price -
                    (product.price * product.discountPercent) / 100,
                ),
            }
          : null);

      return {
        ...product,
        discount: discountFromApi,
      } as Product;
    });
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
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(product),
    });
    console.log("Creating product...", product);
    if (!response.ok) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: CREATE_PRODUCT_ERROR_MESSAGE,
        }),
      );
      // throw new Error(CREATE_PRODUCT_ERROR_MESSAGE);
    }

    const newProduct: Product = await response.json();
    dispatch(
      showAlert({
        type: AlertType.Success,
        message: "Товар успешно создан",
      }),
    );
    return newProduct;
  },
);
export const deleteProductById = createAsyncThunk(
  "product/deleteProductById",
  async (id: Product["id"], { dispatch }) => {
    const response = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-type": "application/json",
      },
    });
    console.log("Response ", response);
    if (!response.ok) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message: DELETE_PRODUCT_ERROR_MESSAGE,
        }),
      );
      // throw new Error(DELETE_PRODUCT_ERROR_MESSAGE);
      console.log("Failed to delete product with id:", id);
      console.log("Response ", response);
    }
    dispatch(
      showAlert({
        type: AlertType.Success,
        message: "Товар успешно удален",
      }),
    );
    return id;
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
    builder.addCase(deleteProductById.fulfilled, (state, { payload }) => {
      const index = state.products.findIndex(
        (product) => product.id === payload,
      );
      state.products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(state.products));
      state.isLoading = false;
    });
    builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
      state.products = payload;
      state.isLoading = false;
    });

    builder.addCase(createProduct.fulfilled, (state, { payload }) => {
      state.products.push(payload);
      state.isLoading = false;
      localStorage.setItem("products", JSON.stringify(state.products));
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
