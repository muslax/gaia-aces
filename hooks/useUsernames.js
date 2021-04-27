import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useUsernames() {
  const { data, error, mutate } = useSWR(`/api/get?q=get-usernames`, fetchJson)

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}