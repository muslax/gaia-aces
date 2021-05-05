import { API } from "config"
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function usePersonae(bid) {
  const { data, error, mutate } = useSWR(`/api/get?q=${API.GET_PERSONAE}&bid=${bid}`, fetchJson)

  return {
    personae: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}