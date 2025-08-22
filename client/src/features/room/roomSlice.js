import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

export const createRoom = createAsyncThunk(
  "room/createRoom",
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/room/create", roomData);
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error creating room:", error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({
          message: "Network error or server not responding",
          error: error.message,
        });
      }
    }
  }
);

export const fetchRooms = createAsyncThunk(
  "room/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/room");

      // Fix: The rooms are in response.data.message.rooms
      return response.data.message.rooms;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({
          message: "Network error or server not responding",
          error: error.message,
        });
      }
    }
  }
);
const roomSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
    currentRoom: null,
    roomCode: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
      state.roomCode = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        const newRoom = action.payload;
        state.loading = false;
        state.rooms.push(newRoom);
        state.currentRoom = newRoom;
        state.roomCode = newRoom.roomCode;
        state.error = null;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchRooms cases
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
        state.error = null;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentRoom } = roomSlice.actions;
export default roomSlice.reducer;
