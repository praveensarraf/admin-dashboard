import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TASKS_API_ENDPOINT } from "../../../utils/constant";

// Upload Tasks File Thunk with Proper Error Handling
export const uploadTasksFile = createAsyncThunk(
  "tasks/uploadTasksFile",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${TASKS_API_ENDPOINT}/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Upload failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async () => {
    const res = await axios.get(`${TASKS_API_ENDPOINT}/get`, {
      withCredentials: true,
    });
    return res.data.data || [];
  }
);

// Tasks Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasksByAgent: [],
    loading: false,
    uploadLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadTasksFile.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadTasksFile.fulfilled, (state) => {
        state.uploadLoading = false;
      })
      .addCase(uploadTasksFile.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload || "Upload failed!";
      })

      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasksByAgent = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default tasksSlice.reducer;
