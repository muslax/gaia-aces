import useBatch from "hooks/useBatch";
import useModulesMeta from "hooks/useModulesMeta";
import fetchJson from "lib/fetchJson";
import { getLastVisitedBatchId } from "lib/storage";

const { useState, useEffect } = require("react")

const Modules = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const { batch, isError, isLoading } = useBatch(batchId);
  const { modules, isError: metaError, isLoading: metaLoading } = useModulesMeta();

  if (isError || isLoading || metaError || metaLoading) return <>...</>;


  return <>
    <pre>
      BATCH {JSON.stringify(batch, null, 2)}<br/>
      MODULES {JSON.stringify(modules, null, 2)}
    </pre>
  </>;
}

export default Modules;