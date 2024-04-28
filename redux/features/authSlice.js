import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from "../utils";
import { DevSettings } from "react-native";

const initialState = {
  isLoggedIn: false,
  data: null,
  error: "",
  loading: false,
};

export const getUserDetail = createAsyncThunk("user/fetch", async () => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  let response = await axios.get(`${baseURL}/user-detail/`, {
    headers: {
      'Authorization': `Token ${jwtToken}`, 
    }, 
  });
  return response.data;
});

export const logoutUser = createAsyncThunk("clear/user", async () => {
  await AsyncStorage.removeItem('jwtToken');
  await AsyncStorage.removeItem('user');
  // navigation.navigate('Login');
  DevSettings.reload();
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
    reducers: {
      getAuth: (state, action) => {
        state.data = action.payload;
      },
      initAuth: (state, action) => {
        state.loading = true;
      },
      successAuth: (state, action) => {
        state.loading = false;
        state.isLoggedIn= true;
      },
      errorAuth: (state, action) => {
        state.loading = false;
      },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getUserDetail.pending, (state, action) => {
          state.loading = true;
        })
        .addCase(getUserDetail.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(getUserDetail.rejected, (state, action) => {
          state.loading = false;
          // state.error = `¡Ups! ¡Algo salió mal! volver al archivo`;
        });
    },
})

export const { getAuth, initAuth, successAuth, errorAuth } = authSlice.actions;
export default authSlice.reducer;