import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (FormData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register", FormData);
      console.log("Register response:", res.data);

      return res.data.data;
    } catch (error) {
      console.error("Register error:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ otp, token, type }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", {
        otp,
        token,
        type,
      });
      console.log("OTP verification response:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("OTP verification error:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      console.log("Login response:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      console.log("Logout response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      console.log("Forgot password response:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", formData);
      console.log("Reset password response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Reset password error:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    accessToken: null,
    verificationToken: null,
    successMessage: null,
    error: null,
  },
  reducers: {
    clearAuthState: (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.verificationToken = null;
      state.successMessage = null;
      state.accessToken = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationToken = action.payload.token;
        state.user = null;
        state.accessToken = null; 

      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      });

    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
      if (action.payload) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken; 
        }
        state.verificationToken = null; 
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      });

    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.verificationToken = null; // Clear verification token on logout
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message|| "Logout failed";
      });

    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
       state.verificationToken = action.payload.token;
        state.successMessage = action.payload.message || "Password reset link sent to your email!";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Forgot password failed";
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Password reset successfully!";
          state.verificationToken = null; 
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Reset password failed";
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
