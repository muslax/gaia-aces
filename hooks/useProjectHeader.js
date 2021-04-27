import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useProjectHeader(pid) {
  const { data, error, mutate } = useSWR(`/api/get?q=get-project-header&pid=${pid}`, fetchJson)

  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}