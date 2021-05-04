import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useGuidedModules() {
  const { data, error, mutate } = useSWR('/api/get?q=get-guided-modules', fetchJson)

  return {
    modules: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}