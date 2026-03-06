import { useAuthStore } from "./auth.store";

const token = useAuthStore.getState().token;

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
    Pragma: "no-cache",
  },
};

export default config;
