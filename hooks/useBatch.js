import { API } from "config"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useBatch(bid) {
  const { data, error, mutate } = useSWR(`/api/get?q=get-batch&bid=${bid}`, fetchJson)

  return {
    batch: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}