import Link from "next/link"

export const Schedules = ({ user, project }) => {
  return <>
    <div className="mb-6">
      <div className="flex items-center text-sm">
        <Link href={`/projects/${project._id}/deployment`}>
          <a className="flex items-center bg-gray-100 hover:bg-gray-200 h-8 rounded-l px-4">
            Web Accsee
          </a>
        </Link>
        <div className="flex items-center h-8 bg-gray-500 text-white rounded-r px-3 cursor-default">
          Schedules
        </div>
      </div>
    </div>
  </>
}