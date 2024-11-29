import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import coffeeReducer from "./slices/coffeeSlice";

// Define the persist configuration for redux-persist
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

// Persist the coffeeReducer
const persistedReducer = persistReducer(persistConfig, coffeeReducer);

// Create and export the Redux store
export const store = configureStore({
  reducer: {
    coffee: persistedReducer,
  },
});

// Create and export the persistor
export const persistor = persistStore(store);
