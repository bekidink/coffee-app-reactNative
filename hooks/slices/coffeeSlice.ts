import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import CoffeeData from "@/data/CoffeeData";
// import BeansData from "../data/BeansData";

// Define the types for the items in the cart, favorites, and order history
export type PriceInfo ={
  size: string;
  price: string;
  currency: string;
  _id: string;
}

export type Coffee= {
  _id: string;
  id: string;
  name: string;
  description: string;
  roasted: string;
  imagelink_square: string;
  imagelink_portrait: string;
  ingredients: string;
  special_ingredient: string;
  prices: PriceInfo[];
  average_rating: number;
  ratings_count: string;
  favourite: boolean;
  type: string;
  index: number;
  __v: number;
}

export type Price= {
  size: string;
  price: string;
  quantity: number;
}

export type CartItem= {
  id: string;
  name: string;
  prices: Price[];
  ItemPrice: string;
}



interface State {
  CoffeeList: Coffee[];
  BeanList: Coffee[];
  CartPrice: string;
  FavoritesList: Coffee[];
  CartList: CartItem[];
  OrderHistoryList: {
    OrderDate: string;
    CartList: CartItem[];
    CartListPrice: string;
  }[];
}

// Initial state of the Redux store
const initialState: State = {
  CoffeeList: [],
  BeanList: [],
  CartPrice: "0",
  FavoritesList: [],
  CartList: [],
  OrderHistoryList: [],
};

// Create the slice with reducers and actions
const coffeeSlice = createSlice({
  name: "coffee",
  initialState,
  reducers: {
    setCoffeeList: (state, action: PayloadAction<Coffee[]>) => {
      state.CoffeeList = action.payload;
    },
    setBeanList: (state, action: PayloadAction<Coffee[]>) => {
      state.BeanList = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const cartItem = action.payload;
      let found = false;

      for (let i = 0; i < state.CartList.length; i++) {
        if (state.CartList[i].id === cartItem.id) {
          found = true;
          let size = false;
          for (let j = 0; j < state.CartList[i].prices.length; j++) {
            if (state.CartList[i].prices[j].size === cartItem.prices[0].size) {
              size = true;
              state.CartList[i].prices[j].quantity++;
              break;
            }
          }
          if (!size) {
            state.CartList[i].prices.push(cartItem.prices[0]);
          }
          state.CartList[i].prices.sort((a, b) =>
            a.size > b.size ? -1 : a.size < b.size ? 1 : 0
          );
          break;
        }
      }

      if (!found) {
        state.CartList.push(cartItem);
      }
    },
    calculateCartPrice: (state) => {
      let totalPrice = 0;
      for (let i = 0; i < state.CartList.length; i++) {
        let tempPrice = 0;
        for (let j = 0; j < state.CartList[i].prices.length; j++) {
          tempPrice +=
            parseFloat(state.CartList[i].prices[j].price) *
            state.CartList[i].prices[j].quantity;
        }
        state.CartList[i].ItemPrice = tempPrice.toFixed(2).toString();
        totalPrice += tempPrice;
      }
      state.CartPrice = totalPrice.toFixed(2).toString();
    },
    addToFavoriteList: (
      state,
      action: PayloadAction<{ type: string; id: string }>
    ) => {
      const { type, id } = action.payload;
      if (type === "Coffee") {
        const coffee = state.CoffeeList.find((item) => item.id === id);
        if (coffee) {
          if (!coffee.favourite) {
            coffee.favourite = true;
            state.FavoritesList.unshift(coffee);
          } else {
            coffee.favourite = false;
          }
        }
      } else if (type === "Bean") {
        const bean = state.BeanList.find((item) => item.id === id);
        if (bean) {
          if (!bean.favourite) {
            bean.favourite = true;
            state.FavoritesList.unshift(bean);
          } else {
            bean.favourite = false;
          }
        }
      }
    },
    deleteFromFavoriteList: (
      state,
      action: PayloadAction<{ type: string; id: string }>
    ) => {
      const { type, id } = action.payload;
      let spliceIndex = -1;

      if (type === "Coffee") {
        const coffee = state.CoffeeList.find((item) => item.id === id);
        if (coffee) coffee.favourite = false;
      } else if (type === "Bean") {
        const bean = state.BeanList.find((item) => item.id === id);
        if (bean) bean.favourite = false;
      }

      for (let i = 0; i < state.FavoritesList.length; i++) {
        if (state.FavoritesList[i].id === id) {
          spliceIndex = i;
          break;
        }
      }

      if (spliceIndex !== -1) {
        state.FavoritesList.splice(spliceIndex, 1);
      }
    },
    incrementCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; size: string }>
    ) => {
      const { id, size } = action.payload;
      const cartItem = state.CartList.find((item) => item.id === id);
      if (cartItem) {
        const price = cartItem.prices.find((p) => p.size === size);
        if (price) price.quantity++;
      }
    },
    decrementCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; size: string }>
    ) => {
      const { id, size } = action.payload;
      const cartItem = state.CartList.find((item) => item.id === id);
      if (cartItem) {
        const price = cartItem.prices.find((p) => p.size === size);
        if (price) {
          if (price.quantity > 1) {
            price.quantity--;
          } else {
            cartItem.prices = cartItem.prices.filter((p) => p.size !== size);
          }
        }
      }
    },
    addToOrderHistoryListFromCart: (state) => {
      let temp = state.CartList.reduce(
        (accumulator, currentValue) =>
          accumulator + parseFloat(currentValue.ItemPrice),
        0
      );
      const orderDate =
        new Date().toDateString() + " " + new Date().toLocaleTimeString();
      state.OrderHistoryList.unshift({
        OrderDate: orderDate,
        CartList: state.CartList,
        CartListPrice: temp.toFixed(2).toString(),
      });
      state.CartList = [];
    },
  },
});

// Export actions for use in components
export const {
  setBeanList,
  setCoffeeList,
  addToCart,
  calculateCartPrice,
  addToFavoriteList,
  deleteFromFavoriteList,
  incrementCartItemQuantity,
  decrementCartItemQuantity,
  addToOrderHistoryListFromCart,
} = coffeeSlice.actions;

// Export reducer for the store
export default coffeeSlice.reducer;
