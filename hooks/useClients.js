import { API } from "config"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useClients() {
  const { data, error, mutate } = useSWR(`/api/get?q=${API.GET_CLIENTS}`, fetchJson)

  return {
    clients: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}