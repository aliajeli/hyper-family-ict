import { create } from "zustand";

const useBranchStore = create((set, get) => ({
  branches: [],
  isLoading: false,

  fetchBranches: async () => {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      set({ branches: data || [] });
    } catch (e) {
      console.error(e);
    }
  },

  addBranch: async () => {
    const newBranch = { name: "New Branch", routerIp: "" };
    const res = await fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBranch),
    });
    const saved = await res.json();
    set((state) => ({ branches: [...state.branches, saved] }));
  },

  updateBranch: async (id, field, value) => {
    try {
      // 1. Optimistic UI Update
      set((state) => ({
        branches: state.branches.map((b) =>
          b.id === id ? { ...b, [field]: value } : b,
        ),
      }));

      // 2. Server Update (Send FULL object or partial)
      // نکته: باید کل آبجکت را بفرستیم یا سرور باید merge کند.
      // بیایید فقط فیلد را بفرستیم.

      const res = await fetch(`/api/branches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });

      if (!res.ok) throw new Error("Update failed");
    } catch (e) {
      console.error(e);
      // Revert if needed (Optional)
      // set((state) => ({
      //   branches: state.branches.map((b) =>
      //     b.id === id ? { ...b, [field]: b[field] } : b,
      //   ),
      // }));
    }
  },

  deleteBranch: async (id) => {
    await fetch(`/api/branches/${id}`, { method: "DELETE" });
    set((state) => ({ branches: state.branches.filter((b) => b.id !== id) }));
  },
}));

export default useBranchStore;
