import useBatch from "hooks/useBatch";
import useModulesMeta from "hooks/useModulesMeta";
import useWorkbook from "hooks/useWorkbook";
import fetchJson from "lib/fetchJson";
import { getLastVisitedBatchId } from "lib/storage";
import Link from "next/link";
import ErrorPage from "./Error";

const { useState, useEffect } = require("react")

const Modules = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const { batch, isError, isLoading } = useBatch(batchId);
  // const { modules, isError: metaError, isLoading: metaLoading } = useModulesMeta();
  const { workbook, isError: workbookError, isLoading: workbookLoading } = useWorkbook();
  const [batchModules, setBatchModules] = useState([])

  useEffect(() => {
    if (workbook && batch) {
      const array = [];
      workbook.modules.forEach(mod => {
        if (batch.modules.includes(mod._id)) {
          array.push(mod);
        }
      })

      array.sort(function(a, b) { return a._id - b._id });
      setBatchModules(array);
    }
  }, [workbook])

  if (isLoading || workbookLoading) return <>...</>;

  if (isError || workbookError) return <ErrorPage title="something" code={batchId} message="Not Found" />

  if (batch.modules.length == 0) return <BatchHasNoModule user={user} project={project} />

  return <>
    <div className="flex items-center h-16 text-sm text-center md:text-left border-b border-gray-300">
    <Link href={`/projects/${project._id}/setup-modules`}>
        <a className="inline-flex rounded border hover:border-gray-300 active:border-gray-400 px-6 py-2 text-blue-500 hover:text-blue-600">
          Edit modules &nbsp; &rarr;
        </a>
      </Link>
    </div>
    <table className="w-full text-sm">
    {batchModules.map((mod, index) => (
      <tbody key={mod._id}>
      <tr className="border-b">
        <td className="w-8 p-2">{index + 1}</td>
        <td className="p-2">
          {mod.moduleName}
        </td>
        <td className="text-right p-2">{mod.domain}</td>
        <td className="w-20 text-right p-2">90 menit</td>
      </tr>
      </tbody>
    ))}
    </table>
    {/* <pre>{JSON.stringify(batch, null, 2)}</pre> */}
    <pre>BATCH MODULES {JSON.stringify(batchModules, null, 2)}</pre>
    <pre>{JSON.stringify(workbook, null, 2)}</pre>
  </>;
}

export default Modules;


function BatchHasNoModule({ user, project }) {
  const o = user.licenseType == 'corporate' ? 'Batch' : 'Proyek';
  return (
    <div className="bg-green-50s text-center p-8 -mt-pxs">
      <h3 className="text-xl font-bold mb-6">
        {`${o} ini belum memiliki modul untuk dijalankan.`}
      </h3>
      <Link href={`/projects/${project._id}/setup-modules`}>
        <a className="inline-flex rounded border hover:border-gray-300 active:border-gray-400 px-6 py-2 text-blue-500 hover:text-blue-600">
          Setup modules &nbsp; &rarr;
        </a>
      </Link>
    </div>
  )
}