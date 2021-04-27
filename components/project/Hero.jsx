import { getBatchKey, getLastVisitedBatch } from "lib/storage";
import { useState } from "react"
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

export const Hero = ({ project, title, isIndex = false }) => {
  const batchKey = getBatchKey(project);
  // const [selected, setSelected] = useState(getSelectedBatch(project));
  const [selected, setSelected] = useState(getLastVisitedBatch(project));
  
  if (!selected) return null;

  function setActiveBatch(e) {
    const id = e._id;
    setSelected(e);
    window.localStorage.setItem(batchKey, id);
  }


  return (
    <div className="aces-wrap bg-gray-50s border-gray-200 pt-7 pb-8">
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
            {!isIndex && (
              <div className="relative w-full py-1s pl-3 pr-8 text-left bg-white rounded border border-gray-300 shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 text-sm">
                <div className="flex">
                  <span className="py-1 pr-2 border-r">Batch</span>
                  <span className="py-1 pl-2 block truncate text-red-500 font-semibold">{selected.batchName}</span>
                </div>
              </div>
            )}
            {isIndex && (
              <SelectBatch
                batches={project.batches}
                value={selected}
                onChange={setActiveBatch}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
