import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error?.response?.data;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  return "An unknown error occurred";
};
