import useBatch from "hooks/useBatch";
import fetchJson from "lib/fetchJson";

const { useState, useEffect } = require("react")

const Modules = ({ user, project, store }) => {
  const currentBatch = store(state => state.currentBatch);
  const setCurrentBatch = store(state => state.setCurrentBatch);

  // const [batchId, setBatchId] = useState(window.localStorage.getItem("batch") ?? project.batches[0]["_id"]);
  // const { batch, isError, isLoading, mutate } = useBatch(batchId);
  const [modules, setModules] = useState([]);
  const [batch, setBatch] = useState(null)

  async function test(bid) {
    const response = await fetchJson(`/api/get?q=get-batch&bid=${bid}`);
    if (response) {
      setBatch(response);
    }
  }

  useEffect(() => {
    test(currentBatch)
  }, [currentBatch])

  // if (isError || isLoading) return null;


  return <>
    BATCH {currentBatch}
    <pre>
      {JSON.stringify(batch, null, 2)}
    </pre>
  </>;
}

export default Modules;