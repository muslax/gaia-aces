import { Switch } from "@headlessui/react";
import { API_ROUTES } from "config/routes";
import useBatch from "hooks/useBatch";
import useModulesMeta from "hooks/useModulesMeta";
import useWorkbook from "hooks/useWorkbook";
import fetchJson from "lib/fetchJson";
import { getLastVisitedBatch, getLastVisitedBatchId } from "lib/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import ErrorPage from "./Error";

const SetupModules = ({ user, project }) => {
  const router = useRouter();
  const batchRef = getLastVisitedBatchId(project);
  const { batch, isError, isLoading } = useBatch(batchRef);
  const { workbook, isLoading: workbookLoading, isError: workbookError } = useWorkbook();
  const [isEditing, setIsEditing] = useState(false);
  const [viewstack, setViewstack] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (batch) {
      setIsEditing(batch.modules.length > 0);
      setSelected(batch.modules);
    }
  }, [batch]);

  if (isLoading || workbookLoading ) return <>...</>;

  // return <ErrorPage title="Annapurna" code={batchRef} message="Not Found" />

  async function saveModules(e) {
    setSubmitting(true);
    const tests = [];
    const sims = [];
    workbook.modules.forEach(mod => {
      if (selected.includes(mod.moduleId)) {
        if (mod.method == 'selftest') {
          tests.push(mod.moduleId);
        } else if (mod.method == 'guided') {
          sims.push(mod.moduleId);
        }
      }
    })
    const body = {
      batchId: batch._id,
      modules: selected,
      tests: tests,
      sims: sims,
    };
    console.log('BODY', body);
    // return;
    const res = fetchJson(API_ROUTES.SaveModules, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res) {
      setSubmitting(false);
      mutate(`/api/get?q=get-batch&bid=${batch._id}`);
      router.push(`/projects/${project._id}/modules`);
    }
  }

  return <>
    {/* <pre>SELECTED {JSON.stringify(batch, null, 2)}</pre> */}
    <div className="bg-green-50s text-center p-8 -mt-pxs">
      <h3 className="text-xl font-bold mb-6">
        Pilih modul-modul ACES sesuai kebutuhan proyek.
      </h3>
      <p className="text-sm text-gray-400 mb-5">
        As the next evolution to Sapper, it inherits much of its functionality
        such as file-based routing, Server Side Rendering, and TypeScript support.
      </p>
    </div>

    {/* <pre>SELECTED {selected.join(" ")}</pre> */}
    <table className="w-full text-sm border-b">
      <thead>
        <tr className="border-b">
          <td colSpan="4" className="py-3 border-t border-gray-300">
            <div className="flex items-center">
              <Switch
                checked={expanded}
                onChange={setExpanded}
                className={`${expanded ? "bg-gray-500" : "bg-gray-300"}
                  relative inline-flex flex-shrink-0 h-[24px] w-[48px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${expanded ? "translate-x-6" : "translate-x-0"}
                    pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
              <span className="ml-3">Show Info</span>
            </div>
          </td>
        </tr>
      </thead>
      {workbook.modules.sort(function(a,b){
        if (a.domain < b.domain) return -1;
        if (a.domain > b.domain) return 1;
        return 0;
      }).map(mod => (
        <tbody key={mod.moduleId}>
          <tr className={
            (batch.modules.includes(mod.moduleId) ? 'bg-gray-50' : '')
            + ` border-t border-gray-200`
          }>
            <td className="w-10 px-3 py-2">
              <input
                type="checkbox"
                checked={selected.includes(mod.moduleId)}
                className="w-5 h-5 rounded border-gray-400 focus:ring focus:ring-offset-0 focus:ring-green-200 focus:ring-opacity-25 focus:outline-none text-green-500"
                onChange={e => {
                  if (e.currentTarget.checked) {
                    setSelected(vs => ([...vs, mod.moduleId]))
                  } else {
                    setSelected(vs => vs.filter(item => item != mod.moduleId))
                  }
                }}
              />
            </td>
            <td className="p-2 font-bold">
              <span
                className="cursor-pointer hover:text-green-600"
                onClick={e => {
                  if (selected.includes(mod.moduleId)) {
                    setSelected(vs => vs.filter(item => item != mod.moduleId))
                  } else {
                    setSelected(vs => ([...vs, mod.moduleId]))
                  }
                }}
              >
                {mod.title}
              </span>
            </td>
            <td className="p-2 text-right">{!expanded && mod.domain}</td>
            <td className="p-2 w-16 text-right whitespace-nowrap">{!expanded && `${mod.maxTime} menit`}</td>
          </tr>
          {expanded && (
            <tr className={
              (batch.modules.includes(mod.moduleId) ? 'bg-gray-50' : '')
            }>
              <td className="w-10 p-2"></td>
              <td colSpan="2" className="p-2 pt-0 pb-3">
                <p className="font-semibold mb-1">{mod.domain} - {mod.maxTime} menit</p>
                <p className="text-gray-500">{mod.description}</p>
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      ))}
    </table>
    <div className="mt-12 text-center">
      <button
        className="inline-flex rounded border hover:border-gray-300 active:border-gray-400 px-6 py-2 text-blue-500 hover:text-blue-600"
        onClick={saveModules}
        >
        Save modules
      </button>
    </div>
    <pre>
      {/* {JSON.stringify(batchRef, null, 2)}<br/> */}
      {/* {JSON.stringify(batch, null, 2)}<br/> */}
      WORKBOOK {JSON.stringify(workbook, null, 2)}<br/>
    </pre>
  </>
}

export default SetupModules;