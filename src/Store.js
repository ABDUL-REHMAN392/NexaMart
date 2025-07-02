import { configureStore } from "@reduxjs/toolkit";
import { conditionReducer } from "./redux/conditionSlices";
import { cartReducer } from "./redux/cartSlice";

export const store=configureStore({
    reducer:{
        condition:conditionReducer,
        cart:cartReducer,
    }
})