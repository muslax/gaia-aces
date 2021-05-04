// 
import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useBatchCredentials(bid) {
  const { data, error, mutate } = useSWR(`/api/get?q=get-batch-credentials&bid=${bid}`, fetchJson)

  return {
    credentials: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}