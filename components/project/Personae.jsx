const { default: useBatchPersonae } = require("hooks/useBatchPersonae")

const Personae = ({ user }) => {
  const { personae, isLoading, isError } = useBatchPersonae(window.localStorage.getItem('batch'));

  if (isError || isLoading) return <>...</>;

  return <>
    <pre>{JSON.stringify(personae, null, 2)}</pre>
  </>;
}

export default Personae;