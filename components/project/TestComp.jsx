import useProject from "hooks/useProject";

export default function TestComp({ pid }) {
  const { project, isError, isLoading } = useProject(pid);

  if (isError || isLoading) return <></>;

  return <>
    <p className="text-xl">{pid}</p>
    <pre>{JSON.stringify(project, null, 2)}</pre>
  </>;
}