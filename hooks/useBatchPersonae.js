import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useBatchPersonae(bid) {
  const { data, error, mutate } = useSWR(`/api/get?q=get-batch-personae&bid=${bid}`, fetchJson)

  return {
    personae: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}