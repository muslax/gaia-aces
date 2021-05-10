import useTestAccess from "hooks/useTestAccess";
import { getLastVisitedBatchId } from 'lib/storage';
import { getBatch } from "lib/utils";

export const Credentials = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const batch = getBatch(batchId, project);
  const { credentials, isError, isLoading, mutate } = useTestAccess(batchId);

  if (isLoading) return <>...</>;

  return <>
    <div className="flex items-center h-16 text-sm text-center md:text-left border-t border-b border-gray-300">
      <a className="inline-flex rounded border hover:border-gray-300 active:border-gray-400 px-6 py-2 text-blue-500 hover:text-blue-600">
        Generate password &nbsp; &rarr;
      </a>
      <span className="ml-4">{new Date(batch.dateOpen).toLocaleString('id')}</span>
      <span className="ml-4">s/d</span>
      <span className="ml-4">{new Date(batch.dateClosed).toLocaleString('id')}</span>
    </div>
    <table className="w-full text-sm">
      <tbody>
        {credentials.map((person, idx) => (
          <tr key={person._id} className="border-b">
            <td className="p-2">{idx + 1}</td>
            <td className="p-2">{person.fullname}</td>
            <td className="p-2">{person.username}</td>
            <td className="p-2 font-mono">
              {!person.xfpwd && <span className="text-red-500">[not set]</span>}
              {person.xfpwd && (user.username != project.admin.username) && <span className="">&bull;&bull;&bull;&bull;&bull;</span>}
              {person.xfpwd && (user.username == project.admin.username) && <span className="">{person.xfpwd.split('').reverse().join('')}</span>}
            </td>
            <td className="p-2">{batch.accessCode}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <pre>
      {/* {JSON.stringify(credentials, null, 2)}<br/> */}
    </pre>
  </>;
}
