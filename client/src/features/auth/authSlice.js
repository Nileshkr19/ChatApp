import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    isInitialized: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
        },
        setInitialized: (state, action) => {
            state.isInitialized = action.payload;
        }
    }
})

export const { setAccessToken, logout, setInitialized } = authSlice.actions;
export default authSlice.reducer;