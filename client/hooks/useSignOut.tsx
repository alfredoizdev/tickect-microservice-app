import axiosIntance from "../lib/axiosInstance";
import { useRouter } from "next/navigation";

const useSingOut = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      const response = await axiosIntance.post("/users/signout");

      if (response.status === 200) {
        router.push("/auth/signin");
      }
    } catch (error) {
      console.log("Error signing out", error);
    }
  };

  return { signOut };
};

export default useSingOut;
