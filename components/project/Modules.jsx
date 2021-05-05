import useWorkbook from "hooks/useWorkbook";
import { getLastVisitedBatchId } from "lib/storage";
import { getBatch } from "lib/utils";
import Link from "next/link";
import ErrorPage from "./Error";

const Modules = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const batch = getBatch(batchId, project);
  const { workbook, isError, isLoading } = useWorkbook();

  if (isLoading) return <>...</>;

  if (isError) return <ErrorPage title="something" code={batchId} message="Not Found" />

  if (batch.modules.length == 0) return <BatchHasNoModule user={user} project={project} />

  function isProjectAdmin() {
    return user.username == project.admin.username;
  }

  return <>
    <div className="flex items-center h-16 text-sm text-center md:text-left border-t border-b border-gray-300">
      {isProjectAdmin() && <Link href={`/projects/${project._id}/setup-modules`}>
        <a className="inline-flex rounded border hover:border-gray-300 active:border-gray-400 px-6 py-2 text-blue-500 hover:text-blue-600">
          Add/remove modules &nbsp; &rarr;
        </a>
      </Link>}
      {!isProjectAdmin() && <p className="">
        Daftar modul ACES dalam batch ini.
      </p>}
    </div>

    <table className="w-full text-sm border-b">
      <tbody>
        {workbook.modules
          .sort(function(a,b){
            if (a.domain < b.domain) return -1;
            if (a.domain > b.domain) return 1;
            return 0;
          })
          .filter(mod => batch.modules.includes(mod.moduleId))
          .map(mod => (
          <tr key={mod.moduleId} className="bg-gray-50s border-b align-top">
            <td className="w-12s text-right px-3 py-4">
              {mod.method == 'selftest' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>}
              {mod.method == 'guided' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>}
            </td>
            <td className="p-3 pl-0 pb-4 text-gray-700">
              <div className="text-base font-bold">{mod.title}</div>
              <div className="flex items-center text-sm font-bold my-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="mx-2">Maks. {mod.maxTime} menit</span>
                {mod.method == 'selftest' && <span className="">test online mandiri</span>}
                {mod.method == 'guided' && <span className="text-green-600">dipandu asesor</span>}
              </div>
              <div className="text-sm text-gray-500">{mod.description}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>




    {/* <pre>{JSON.stringify(project, null, 2)}</pre> */}
    <pre>BATCH MODULES {JSON.stringify(batch, null, 2)}</pre>
    {/* <pre>{JSON.stringify(workbook, null, 2)}</pre> */}
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

/*

<tbody key={mod.moduleId}>
          <tr className={
            (batch.modules.includes(mod.moduleId) ? 'bg-gray-50' : '')
            + ` border-bs border-gray-200`
          }>
            <td className="w-10 px-3 py-2">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-400 focus:ring focus:ring-offset-0 focus:ring-green-200 focus:ring-opacity-25 focus:outline-none text-green-500"
              />
            </td>
            <td className="p-2 text-base font-bold">
              <span
                className="cursor-pointer hover:text-green-600"
              >
                {mod.title}
              </span>
            </td>
            <td className="p-2 text-right"></td>
            <td className="p-2 w-16 text-right whitespace-nowrap"></td>
          </tr>
            <tr className={
              (batch.modules.includes(mod.moduleId) ? 'border-b bg-gray-50' : '')
            }>
              <td className="w-10 p-2"></td>
              <td colSpan="2" className="p-2 pt-0 pb-3">
                <p className="font-semibold mb-1">{mod.domain} - {mod.maxTime} menit</p>
                <p className="text-gray-500">{mod.description}</p>
              </td>
              <td></td>
            </tr>
        </tbody>

*/