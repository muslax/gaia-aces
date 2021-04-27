import TestComp from "components/project/TestComp";
import useProjectHeader from "hooks/useProjectHeader";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";
import create from "zustand";

const useStore = create((set, get) =>({
  currentBatch: null,
  setCurrentBatch: (_batch) => set((state) => ({ currentBatch: _batch }))
}))

const Test = () => {
  const router = useRouter();
  const { pid } = router.query;
  const { user } = useUser();

  if (pid) window.localStorage.setItem('test', pid);
  
  // const currentBatch = useStore(state => state.currentBatch);
  // const setCurrentBatch = useStore(state => state.setCurrentBatch);
  // setCurrentBatch(window.localStorage.getItem("batch"));

  
  return <>
    <p>{pid} - {`currentBatch`}</p>
    {/* <pre>{JSON.stringify(project, null, 2)}</pre> */}

    <TestComp pid={pid} />
  </>;
}

export default Test;


// function TestComp({ pid }) {
//   const { project, isError, isLoading } = useProjectHeader(pid);

//   if (isError || isLoading) return <></>;
  
//   return <>
//     <pre>{JSON.stringify(project, null, 2)}</pre>
//   </>;
// }