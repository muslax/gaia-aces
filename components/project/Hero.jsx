import { useEffect, useState } from "react"
import SelectBatch from "./SelectBatch"

export const Hero = ({ project, title }) => {
  const [selected, setSelected] = useState(null);
  const lsBatch = window.localStorage.getItem('batch');

  window.localStorage.setItem('project', project._id);
  const activeBatch = window.localStorage.getItem('batch');

  if (activeBatch == undefined || activeBatch == "") {
    window.localStorage.setItem('batch', project.batches[0]["_id"]);
    setSelected(project.batches[0]);
  } else {
    let validBatch = false;
    project.batches.forEach(bacth => {
      if (bacth._id == activeBatch) {
        validBatch = true;
      }
    })

    if (!validBatch) {
      window.localStorage.setItem('batch', project.batches[0]["_id"]);
      setSelected(project.batches[0]);
    }
  }

  useEffect(() => {
    project.batches.forEach(batch => {
      if (batch._id == lsBatch) {
        setSelected(batch);
      }
    });
  }, [lsBatch])

  useEffect(() => {
    if (selected) {
      window.localStorage.setItem('batch', selected._id);
    }
  }, [selected])

  if (!selected) return null;

  function setActiveBatch(e) {
    const id = e._id;
    setSelected(e);
    window.localStorage.setItem('batch', id);
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
            <SelectBatch
              batches={project.batches}
              value={selected}
              onChange={setActiveBatch}
            />
          </div>
        </div>
      </div>
    </div>
  )
}