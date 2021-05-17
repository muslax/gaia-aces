import { API } from "config"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useGuests(bid) {
  const { data, error, mutate } = useSWR(`/api/get?q=${API.GET_GUESTS}&bid=${bid}`, fetchJson)

  return {
    guests: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}