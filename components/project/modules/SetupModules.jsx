import { Switch } from "@headlessui/react";
import { API } from "config";
import useWorkbook from "hooks/useWorkbook";
import fetchJson from "lib/fetchJson";
import { getLastVisitedBatchId } from "lib/storage";
import { getBatch } from "lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const SetupModules = ({ user, project, mutate }) => {
  const router = useRouter();
  const batchId = getLastVisitedBatchId(project);
  const batch = getBatch(batchId, project);
  const { workbook, isLoading, isError } = useWorkbook();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (batch) {
      setSelected(batch.modules);
    }
  }, [batch]);

  if (isLoading ) return <>...</>;

  async function saveModules(e) {
    setSubmitting(true);
    const tests = [];
    const sims = [];
    workbook.modules.forEach(mod => {
      if (selected.includes(mod.moduleId)) {
        let obj = {};
        obj[mod.moduleId] = [mod.length, 0];
        if (mod.method == 'selftest') {
          // tests.push(mod.moduleId);
          tests.push(obj);
        } else if (mod.method == 'guided') {
          // sims.push(mod.moduleId);
          sims.push(obj);
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
    const res = fetchJson(`/api/post?q=${API.SAVE_MODULES}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res) {
      mutate();
      setSubmitting(false);
      setDone(true);
    }
  }

  return <>
    <div className="bg-green-50s text-center p-8 -mt-pxs">
      <h3 className="text-xl font-bold mb-6">
        Pilih modul-modul ACES sesuai kebutuhan proyek.
      </h3>
      <p className="text-sm text-gray-400 mb-5">
        As the next evolution to Sapper, it inherits much of its functionality
        such as file-based routing, Server Side Rendering, and TypeScript support.
      </p>
    </div>

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
      {/* WORKBOOK {JSON.stringify(workbook, null, 2)}<br/> */}
    </pre>
    {submitting && <div className="fixed z-50 w-full h-full top-0 left-0 flex items-center justify-center bg-gray-400 bg-opacity-20">
      <div className="w-72 rounded border border-gray-400 bg-white shadow">
        <h3 className="text-xl mx-4 my-2">Saving modules</h3>
        <div className="progress rounded-b bg-gray-300 h-2"></div>
      </div>
    </div>}
    {done && <div className="fixed z-50 w-full h-full top-0 left-0 flex items-center justify-center bg-gray-400 bg-opacity-20">
      <div className="w-72 rounded border border-gray-400 bg-white shadow">
        <h3 className="text-xl mx-4 my-2">Modules saved</h3>
        <div className="mx-4 my-4 text-center">
          <button
            className="relative w-fulls py-1 px-4 text-left bg-white rounded border border-gray-300 hover:border-gray-400 active:border-gray-500 shadow-sm text-sm"
            onClick={e => router.push(`/projects/${project._id}/modules`)}>
            Close
          </button>
        </div>
      </div>
    </div>}
  </>
}
