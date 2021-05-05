import { API } from "config"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useUsernames() {
  const { data, error, mutate } = useSWR(`/api/get?q=${API.GET_USERNAMES}`, fetchJson)

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}