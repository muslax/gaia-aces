import { getLastVisitedBatchId } from "lib/storage";

const { default: useBatchPersonae } = require("hooks/useBatchPersonae")

const Personae = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const { personae, isLoading, isError } = useBatchPersonae(batchId);

  if (isError || isLoading) return <>...</>;

  return <>
    <pre>{JSON.stringify(personae, null, 2)}</pre>
  </>;
}

export default Personae;