import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice";
import brandSlice from "./BrandSlice";
import categoryReducer from "./CategorySlice";
import commonSlice from "./CommonSlice";
import productReducer from "./ProductSlice";
import userSlice from "./UserSlice";
import adminSlice from "./adminSlice";

export const store = configureStore({
  reducer: {
    common: commonSlice,
    category: categoryReducer,
    product: productReducer,
    brand: brandSlice,
    user: userSlice,
    auth: authSlice,
    admin: adminSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
