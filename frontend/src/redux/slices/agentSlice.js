import { createSlice } from "@reduxjs/toolkit";

const agentSlice = createSlice({
  name: "agents",
  initialState: {
    agents: [],
    loading: false,
  },
  reducers: {
    setAgents: (state, action) => {
      state.agents = action.payload;
    },
    addAgent: (state, action) => {
      state.agents.push(action.payload);
    },
    deleteAgent: (state, action) => {
      state.agents = state.agents.filter(agent => agent._id !== action.payload);
    },
    setAgentLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAgents, addAgent, deleteAgent, setAgentLoading } = agentSlice.actions;
export default agentSlice.reducer;
