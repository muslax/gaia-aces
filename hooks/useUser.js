import { API_ROUTES } from "config/routes";
import useSWR from "swr";

export default function useUser() {
  const { data: user, error, mutate: mutateUser } = useSWR(API_ROUTES.GetUser);

  const isLoading = !user && !error;

  return { user, mutateUser, isLoading };
}