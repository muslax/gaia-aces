import { getLastVisitedBatchId } from "lib/storage";
import Link from "next/link";
import { useState } from "react";

const { default: useBatchPersonae } = require("hooks/useBatchPersonae")

const Personae = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const { personae, isLoading, isError } = useBatchPersonae(batchId);
  const [filter, setFilter] = useState('');

  if (isError || isLoading) return <>...</>;

  return <>
    <div className="flex items-center rounded-md bg-gray-100 px-3 py-3 -mt-1 mb-5">
      <div className="flex-grow pr-3s">
        <input
          type="text"
          placeholder="Search"
          className={`
          w-full px-3 py-1 text-sm rounded border-gray-300 shadow-sm
          focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50
          `}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      {user.username == project.admin.username && <>
        <Link href="#">
          <a
            className="block text-sm border px-3 py-1 ml-3 "
            onClick={e => {
              e.preventDefault()
            }}
          >Add</a>
        </Link>
        <Link href={`/projects/${project._id}/import-csv`}>
          <a
            className="block text-sm rounded border border-gray-300 hover:border-gray-400 hover:shadow-sm ml-3 px-3 py-1"
          >Import CSV</a>
        </Link>
      </>}
    </div>
    {/* <h3 className="text-xl font-bold mt-5s mb-1">Daftar peserta</h3> */}
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <td colSpan="4" className="p-2">
            Daftar peserta
          </td>
        </tr>
      </thead>
      {personae.filter(person => person.fullname.toLowerCase().includes(filter)).map((person, index) => (
        <tbody key={person._id}>
          <tr className="border-b">
            <td className="w-10 p-2">{ index + 1}</td>
            <td className="p-2">{person.fullname}</td>
            <td className="w-10 p-2">{person.tests.length}</td>
            <td className="w-10 p-2">{person.sims.length}</td>
          </tr>
        </tbody>
      ))}
    </table>
    <pre>{JSON.stringify(personae, null, 2)}</pre>
  </>;
}

export default Personae;