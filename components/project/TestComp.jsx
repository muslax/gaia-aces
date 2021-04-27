import useProjectHeader from "hooks/useProjectHeader";

export default function TestComp({ pid }) {
  const { project, isError, isLoading } = useProjectHeader(pid);

  if (isError || isLoading) return <></>;
  
  return <>
    <p className="text-xl">{pid}</p>
    <pre>{JSON.stringify(project, null, 2)}</pre>
  </>;
}