import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API, baseURL } from '../utils';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  items: [],
  shoppingCart: null,
  location: null,
  error: null,
  loading: false
}

export const ProductAllList = createAsyncThunk("product/fetch", async () => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  let response = await axios.get(`${baseURL}/products/`, {
    headers: {
      'Authorization': `Token ${jwtToken}`, 
    }, 
  });
  // let response = await API.get("/products/");
  // console.log(response.data)
  return response.data;
});

export const fetchCartt = createAsyncThunk("cart/fetch", async () => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  let response = await axios.get(`${baseURL}/order-summary/`, {
    headers: {
      'Authorization': `Token ${jwtToken}`, 
    }, 
  });
  // console.log("from store", response.data);
  // console.log("rdux store");
  return response.data;
});

export const handleAddToCart = createAsyncThunk("cart/add", async (id, { dispatch }) => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  let response = await axios.post(`${baseURL}/add-to-cart/${id}/`, null, {
    headers: {
      'Authorization': `Token ${jwtToken}`, 
    }, 
  });
    dispatch(fetchCartt());
  return response.data;
});

export const removeFromBasket = createAsyncThunk("cart/remove", async (id, { dispatch }) => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  let response = await axios.post(`${baseURL}/order-item/update-quantity/${id}/`, null, {
    headers: {
      'Authorization': `Token ${jwtToken}`, 
    }, 
  });
    dispatch(fetchCartt());
  return response.data;
});

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    getLocation: (state, action) => {
      state.location = action.payload;
      // console.log("loc", action.payload);
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(ProductAllList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(ProductAllList.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null
        // state.user_id = action.payload?.user_id;
      })
      .addCase(ProductAllList.rejected, (state, action) => {
        state.loading = false;
        // state.error = `¡Ups! ¡Algo salió mal! volver al archivo`;
      })
      .addCase(fetchCartt.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchCartt.fulfilled, (state, action) => {
        state.shoppingCart = action.payload;
        state.loading = false;
        state.error = null
        // state.user_id = action.payload?.user_id;
      })
      .addCase(fetchCartt.rejected, (state, action) => {
        state.loading = false;
        // state.error = `¡Ups! ¡Algo salió mal! volver al archivo`;
      })
      .addCase(handleAddToCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(handleAddToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null
      })
      .addCase(handleAddToCart.rejected, (state, action) => {
        state.loading = false;
        // state.error = `¡Ups! ¡Algo salió mal! volver al archivo`;
      });
  },
})

// Action creators are generated for each case reducer function
export const { getLocation } = basketSlice.actions;
export default basketSlice.reducer