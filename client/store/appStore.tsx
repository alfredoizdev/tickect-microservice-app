import axiosInstance from "@/lib/axiosInstance";
import { TUser } from "@/types/User";
import { create } from "zustand";

type Store = {
  currentUser: TUser | null;
  fetchUser: () => Promise<void>;
};

const useAppStore = create<Store>((set) => ({
  currentUser: null,
  fetchUser: async () => {
    try {
      const response = await axiosInstance.get("/users/currentuser");

      if (!response.data) {
        return set({ currentUser: null });
      }

      return set({ currentUser: response.data.currentUser });
    } catch (error) {
      console.log("error =====>", error);
      return set({ currentUser: null });
    }
  },
}));

export default useAppStore;
