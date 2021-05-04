const { default: fetchJson } = require("lib/fetchJson");
const { default: useSWR } = require("swr");

const Prefetching = ({ url }) => {
  const { data, error } = useSWR(url ? url : null, fetchJson);

  if (!url) return null;

  if (!data && !error) return <></>;

  return <></>;
}

export default Prefetching;