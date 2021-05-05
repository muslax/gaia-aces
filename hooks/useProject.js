import { API } from "config"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useProject(pid) {
  const { data, error, mutate } = useSWR(`/api/get?q=${API.GET_PROJECT}&pid=${pid}`, fetchJson)

  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}