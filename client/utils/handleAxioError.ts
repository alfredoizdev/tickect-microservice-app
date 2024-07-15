import { toast } from "sonner";

const handleAxiosError = (error: any) => {
  const status = error.response?.status;
  switch (status) {
    case 400:
      toast.error("Invalid email or password");
      break;
    // Add more cases as needed
    default:
      toast.error("Something went wrong.");
  }
};

export default handleAxiosError;
