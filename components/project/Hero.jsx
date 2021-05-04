import fetchJson from "lib/fetchJson";
import { getBatchKey, getLastVisitedBatch } from "lib/storage";
import { useEffect, useState } from "react"
import useSWR from "swr";
import SelectBatch from "./SelectBatch"

// function getSelectedBatch(project) {
//   const lsBatch = window.localStorage.getItem("batch");
//   let selectedBatch = null;

//   project.batches.forEach(b => {
//     if (b._id == lsBatch) {
//       selectedBatch = b;
//     }
//   })
//   return selectedBatch;
// }

export const Hero = ({ user, project, title, isIndex = false }) => {
  const batchKey = getBatchKey(project);
  // const [selected, setSelected] = useState(getSelectedBatch(project));
  const [selected, setSelected] = useState(getLastVisitedBatch(project));
  const [batchUrl, setBatchUrl] = useState(null);
  const [workbookUrl, setWorkbookUrl] = useState(null);

  useEffect(() => {
    setWorkbookUrl('/api/get?q=get-workbook');
    setBatchUrl(`/api/get?q=get-batch&bid=${selected._id}`);
  }, [selected])

  if (!selected) return null;

  function setActiveBatch(e) {
    const id = e._id;
    setSelected(e);
    window.localStorage.setItem(batchKey, id);
    // setWorkbookUrl('/api/get?q=get-workbook');
    // setBatchUrl(`/api/get?q=get-batch&bid=${id}`);
  }


  return (
    <div className="aces-wrap pt-7 pb-8">
      <div className="absolute r-0 text-sm text-red-500">
        &gt;
        <Prefetching url={batchUrl} />
        <Prefetching url={workbookUrl} />
      </div>
      <div className="aces-geist text-center md:text-left">
        <h3 className="text-gray-600 text-2xl md:text-3xl font-light">{title}</h3>
        <div className="text-green-600 text-lg font-bold">
          {project.title}
        </div>
        <div className="text-sm font-medium mb-2">
          {project.clientName}
        </div>
        <div className="text-center md:text-left">
          <div className="inline-block text-left">
            {(!isIndex || user.licenseType == 'personal') && (
              <div className="relative w-full py-1s pl-2 pr-3 text-left bg-white rounded border border-gray-300 shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 text-sm">
                <div className="flex items-center">
                  {/* <span className="py-1 pr-2 border-r">Batch</span> */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  <span className="py-1 pl-2 block truncate text-gray-700 font-semibold">{selected.batchName}</span>
                </div>
              </div>
            )}
            {isIndex && user.licenseType == 'corporate' && (
              <SelectBatch
                batches={project.batches}
                value={selected}
                onChange={setActiveBatch}
              />
            )}
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(selected, null, 2)}</pre>
    </div>
  )
}

const Prefetching = ({ url }) => {
  const { data, error } = useSWR(url ? url : null, fetchJson);

  if (!url) return null;

  if (!data && !error) return <>-</>;

  return <>&gt;</>;
}