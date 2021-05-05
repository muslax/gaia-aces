import { API } from "config"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useProjects() {
  const { data, error, mutate } = useSWR(`/api/get?q=${API.GET_PROJECTS}`, fetchJson)

  return {
    projects: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}