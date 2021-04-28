import useBatch from "hooks/useBatch";
import useModulesMeta from "hooks/useModulesMeta";
import { getLastVisitedBatch, getLastVisitedBatchId } from "lib/storage";
import { useEffect, useState } from "react";
import ErrorPage from "./Error";

const SetupModules = ({ user, project }) => {
  const batchRef = getLastVisitedBatchId(project);
  const { batch, isError, isLoading } = useBatch(batchRef);
  const { modules, isError: metaError, isLoading: metaLoading } = useModulesMeta();
  const [isEditing, setIsEditing] = useState(false);
  const [viewstack, setViewstack] = useState([]);

  useEffect(() => {
    if (batch) {
      setIsEditing(batch.modules.length > 0);
    }
  }, [batch]);

  if (isLoading || metaLoading ) return <>...</>;

  // return <ErrorPage title="Annapurna" code={batchRef} message="Not Found" />

  return <>
    {!isEditing && (
      <div className="bg-green-50s text-center p-8 -mt-pxs">
        <h3 className="text-xl font-bold mb-6">
          Pilih modul-modul ACES sesuai kebutuhan proyek.
        </h3>
        <p className="text-sm text-gray-400 mb-5">
          As the next evolution to Sapper, it inherits much of its functionality
          such as file-based routing, Server Side Rendering, and TypeScript support.
        </p>
      </div>
    )}
    {isEditing && (
      <div className="bg-green-50s text-center p-8 -mt-pxs">
        <h3 className="text-xl font-bold mb-6">
          Perhatian...
        </h3>
        <p className="text-sm text-gray-400 mb-5">
          Mengedit konfigurasi modul menyebabkan kustomisasi assignment berubah.
        </p>
      </div>
    )}

    <table className="w-full text-sm border-b">
      <thead>
        <tr className="border-b">
          <td colSpan="4" className="p-2">Annapurna</td>
        </tr>
      </thead>
      {modules.map(mod => (
        <tbody key={mod._id}>
          <tr className={
            (batch.modules.includes(mod._id) ? 'bg-gray-50' : '')
            + ` border-t border-gray-200`
          }>
            <td className="w-10 px-3 py-2">
              <input
                type="checkbox"
                defaultChecked={batch.modules.includes(mod._id)}
                className="w-5 h-5 rounded-full focus:outline-none text-green-500"
              />
            </td>
            <td className="p-2 font-bold">
              <span
                className="cursor-pointer hover:text-green-600"
                onClick={e => {
                  if (viewstack.includes(mod._id)) {
                    setViewstack(vs => vs.filter(item => item != mod._id))
                  } else {
                    setViewstack(vs => ([...vs, mod._id]))
                  }
                }}
              >
                {mod.moduleName}
              </span>
            </td>
            <td className="p-2 text-right">{!viewstack.includes(mod._id) && mod.domain}</td>
            <td className="p-2 w-16 text-right whitespace-nowrap">{!viewstack.includes(mod._id) && '90 menit'}</td>
          </tr>
          {viewstack.includes(mod._id) && (
            <tr className={
              (batch.modules.includes(mod._id) ? 'bg-gray-50' : '')
            }>
              <td className="w-10 p-2"></td>
              <td colSpan="2" className="p-2 pt-0 pb-3">
                <p className="font-semibold mb-1">{mod.domain} - 90 menit</p>
                <p className="text-gray-500">{mod.description}</p>
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      ))}
    </table>
    <pre>
      {/* {JSON.stringify(batchRef, null, 2)}<br/> */}
      {/* {JSON.stringify(batch, null, 2)}<br/> */}
      {/* {JSON.stringify(modules, null, 2)}<br/> */}
    </pre>
  </>
}

export default SetupModules;