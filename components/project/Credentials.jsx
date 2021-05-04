import useBatch from "hooks/useBatch";
import { createRandomPassword } from "lib/utils";

const { default: useBatchCredentials } = require("hooks/useBatchCredentials");
const { getLastVisitedBatchId } = require("lib/storage");

const Credentials = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const { batch, isError: batchError, isLoading: batchLoading } = useBatch(batchId);
  const { credentials, isError, isLoading, mutate } = useBatchCredentials(batchId);

  if (isLoading || batchLoading) return <>...</>;

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

export default Credentials;
// donisu jtdhs