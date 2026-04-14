// permissionStore.ts
import { create } from 'zustand';

interface PermissionStore {
  permissions: Record<string, any>;
  setPermissions: (val: Record<string, any>) => void;
  hasPermission: (id: string) => boolean;
}

export const usePermissionStore = create<PermissionStore>((set, get) => ({
  permissions: {},
  setPermissions: (val: Record<string, any>) => set({ permissions: val }),
  hasPermission: (id: string) => !!get().permissions[id],
}));
