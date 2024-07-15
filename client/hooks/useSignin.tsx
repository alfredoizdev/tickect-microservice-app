import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import handleAxiosError from "@/utils/handleAxioError";

type Inputs = {
  email: string;
  password: string;
};

const useSignin = (customRedirectUrl: string = "/members/home") => {
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(`/api/users/signin`, data);

      if (response.status === 200 || response.status === 201) {
        toast.success("Signed up successfully");
        router.push(customRedirectUrl);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        handleAxiosError(error);
      } else {
        // Handle non-Axios errors if necessary
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return { onSubmit };
};

export default useSignin;
