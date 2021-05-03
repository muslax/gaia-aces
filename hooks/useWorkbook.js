import fetchJson from "lib/fetchJson"
import useSWR from "swr"

export default function useWorkbook(pid) {
  const { data, error, mutate } = useSWR(`/api/get?q=get-workbook`, fetchJson)

  return {
    workbook: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}