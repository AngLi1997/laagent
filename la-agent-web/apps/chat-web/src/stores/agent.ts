import { create } from 'zustand';

export interface AgentInfoType {
  id?: string;
  name?: string;
  description?: string;
  icon_url?: string;
}

interface AgentState {
  agent: AgentInfoType;
  setAgent: (val: AgentInfoType) => void;
  setAgentName: (name: string) => void;
  getAgent: () => AgentInfoType;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agent: {},
  setAgent: async (val: AgentInfoType) => {
    set({ agent: val });
  },
  setAgentName: (name: string) => set({ agent: { ...get().agent, name } }),
  getAgent: () => get().agent,
}));
