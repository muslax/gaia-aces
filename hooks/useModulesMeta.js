import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useModulesMeta() {
  const { data, error, mutate } = useSWR('/api/get?q=get-modules-meta', fetchJson)

  return {
    modules: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}