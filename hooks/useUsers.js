import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useUsers() {
  const { data, error, mutate } = useSWR('/api/get?q=get-users', fetchJson)

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}