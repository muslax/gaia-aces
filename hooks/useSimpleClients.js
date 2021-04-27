import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useSimpleClients() {
  const { data, error, mutate } = useSWR('/api/get?q=get-simple-clients', fetchJson)

  return {
    clients: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}