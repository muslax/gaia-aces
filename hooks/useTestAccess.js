import { API } from "config"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useTestAccess(bid) {
  const { data, error, mutate } = useSWR(`/api/get?q=${API.GET_TEST_ACCESS}&bid=${bid}`, fetchJson)

  return {
    credentials: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}