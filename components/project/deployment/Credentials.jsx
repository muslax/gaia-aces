import useTestAccess from "hooks/useTestAccess";

export const Credentials = ({ user, project, batch }) => {
  const { credentials, isError, isLoading, mutate } = useTestAccess(batch._id);

  if (isLoading) return <>...</>;

  return <>
    <table className="w-full text-sm">
      <tbody>
        <tr className="border-b border-gray-300">
          <td className="w-8 p-2">#</td>
          <td className="p-2">Nama lengkap</td>
          <td className="w-20 p-2">Token</td>
          <td className="w-24 p-2">Username</td>
          <td className="w-20 p-2">Password</td>
        </tr>
        {credentials.map((person, idx) => (
          <tr key={person._id} className="border-b">
            <td className="p-2">{idx + 1}</td>
            <td className="p-2">{person.fullname}</td>
            <td className="p-2">{batch.accessCode ? batch.accessCode : 'not set'}</td>
            <td className="p-2">{person.username}</td>
            <td className="p-2 font-mono">
              {!person.xfpwd && <span className="text-red-500">[not set]</span>}
              {person.xfpwd && (user.username != project.admin.username) && <span className="">&bull;&bull;&bull;&bull;&bull;</span>}
              {person.xfpwd && (user.username == project.admin.username) && <span className="">{person.xfpwd.split('').reverse().join('')}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
}
