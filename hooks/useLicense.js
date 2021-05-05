import { API } from "config"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export function useLicense() {
  const { data, error, mutate } = useSWR(`/api/get?q=${API.GET_LICENSE}`, fetchJson)

  return {
    license: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}