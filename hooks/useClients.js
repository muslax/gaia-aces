import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useClients() {
  const { data, error, mutate } = useSWR('/api/get?q=get-clients', fetchJson)

  return {
    clients: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}