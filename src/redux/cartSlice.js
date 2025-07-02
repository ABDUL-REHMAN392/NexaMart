import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: []
  },
  reducers: {
    setCart:(state,action)=>{
    state.cart=action.payload;
    },
    addCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1 });
      }
    },
    increaseQuantity:(state,action)=>{
       
       state.cart=state.cart.map(item=>{
            if(item.id===action.payload)
             return {...item,quantity:item.quantity+1};
             else
            return item;
        })
        
    },
    decreaseQuantity:(state,action)=>{
        state.cart=state.cart.map(item=>{
            if(item.id===action.payload)
                return {...item,quantity:item.quantity-1};
            else
            return item;
        })
        
    },
    dltItem:(state,action)=>{
        state.cart=state.cart.filter(item=>item.id!==action.payload);
    }
  }
});

export const cartReducer = cartSlice.reducer;
export const { addCart,increaseQuantity,decreaseQuantity,dltItem,setCart} = cartSlice.actions;
