import useTestAccess from "hooks/useTestAccess";
import { getLastVisitedBatchId } from 'lib/storage';
import { getBatch } from "lib/utils";

export const Credentials = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const batch = getBatch(batchId, project);
  const { credentials, isError, isLoading, mutate } = useTestAccess(batchId);

  if (isLoading) return <>...</>;

  return <>
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
