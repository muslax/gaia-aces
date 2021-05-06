import Prefetching from "components/Prefetching";
import { API } from "config";
import useProjects from "hooks/useProjects";
import Link from "next/link";
import Heading from "./Heading";

export default function Dashboard({ user }) {
  const { projects, isLoading } = useProjects();

  if (isLoading) return <></>;

  return <>
    <Heading title="Recent Projects">
      {user.licenseOwner && <Link href="/new-project">
        <a className="inline-flex items-center bg-white shadow-sm hover:shadow rounded-sm px-4 h-8 border border-plum-500 hover:border-plum-600 text-sm text-plum-600 font-semibold">
          New Project
        </a>
      </Link>}
    </Heading>
    <table className="w-full text-sm">
      <thead className="font-semibold">
        <tr className="border-b border-gray-300 border-opacity-50">
          <td className="w-9 p-0">
            <div className="rounded-tl-md bg-gray-200 bg-opacity-50 pt-4 pb-3 px-1">&nbsp;</div>
          </td>
          <td className="p-0">
            <div className="rounded-tr-md md:rounded-none bg-gray-200 bg-opacity-50 p-3 pt-4">Proyek &amp; Klien</div>
          </td>
          <td className="w-40 hidden md:table-cell w-36 text-center p-0">
            <div className="rounded-tr-md bg-gray-200 bg-opacity-50 p-3 pt-4">Admin</div>
          </td>
        </tr>
      </thead>
      {/* <FakeRows /> */}
      <tbody>
        {projects.map(project => (
          <tr key={project._id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="py-2 pl-3 text-center">
              <div className="mx-auto w-6 h-6 rounded-full bg-gray-300"></div>
            </td>
            <td className="px-3 py-2">
              <Link href={`/projects/${project._id}`}>
                <a className="inline-block hover:text-blue-500">
                  <div className="font-medium truncate">
                    {project.title}
                  </div>
                  <div className="text-gray-500 font-light">
                    {project.client.orgName}
                  </div>
                </a>
              </Link>
            </td>
            <td className="hidden md:table-cell text-center text-gray-500 px-3 py-2">
              {project.adminRef.fullname}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {/* <pre>{JSON.stringify(projects, null, 2)}</pre> */}
    <div className="fixed top-0 left-0 opacity-0">
      <Prefetching url={`/api/get?q=${API.GET_CLIENTS}`} />
      <Prefetching url={`/api/get?q=${API.GET_USERS}`} />
      <Prefetching url={`/api/get?q=${API.GET_LICENSE}`} />
      {projects.map(project => <Prefetching key={project._id} url={`/api/get?q=${API.GET_PROJECT}&pid=${project._id}`} />)}
    </div>
  </>;
}

function FakeRows() {
  return (
    <tbody>
      <tr className="border-b border-gray-200">
        <td className="py-2 pl-3 text-center">
          <div className="mx-auto w-6 h-6 rounded-full bg-yellow-200"></div>
        </td>
        <td className="px-3 py-2">
          <div className="font-medium truncate">
            Potential Review Level Supervisor
          </div>
          <div className="text-gray-500 font-light">
            PT Saloka Indah Perkasa
          </div>
        </td>
        <td className="hidden md:table-cell text-center text-gray-500 px-3 py-2">
          Murdika Intan
        </td>
      </tr>
      <tr className="border-b border-gray-200">
        <td className="py-2 pl-3 text-center">
          <div className="mx-auto w-6 h-6 rounded-full bg-green-200"></div>
        </td>
        <td className="px-3 py-2">
          <div className="font-medium truncate">
            Potential Review Level Supervisor
          </div>
          <div className="text-gray-500 font-light">
            PT Saloka Indah Perkasa
          </div>
        </td>
        <td className="hidden md:table-cell text-center text-gray-500 px-3 py-2">
          Murdika Intan
        </td>
      </tr>
    </tbody>
  )
}
