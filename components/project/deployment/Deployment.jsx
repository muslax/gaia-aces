import useBatch from "hooks/useBatch"
import useWorkbook from "hooks/useWorkbook"
import fetchJson from "lib/fetchJson"
import { getLastVisitedBatchId }from  "lib/storage"
import Link from "next/link";
import { Credentials } from "./Credentials";
import WebAccess from "./WebAccess";

export const Deployment = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);

  const { workbook, isError, isLoading } = useWorkbook();
  const { batch, isError: batchError, isLoading: batchLoading, mutate } = useBatch(batchId)

  // const [codeMsg, setCodeMsg] = useState('')

  function isDeployable() {
    return deploymentReqs.length == 0;
  }

  async function checkToken(e) {
    const val = e.target.value.toLowerCase()
    setCode(val)
    if (val.length < 5) {
      setIsCodeValid(false)
      setCodeMsg('Minimum 5 karakter')
    }
    if (val.length >= 5 && val.length <= 20) {
      const url = `/api/get?q=check-access-code&token=${val}`
      const response = await fetchJson(url)
      if (response.message == 'available') {
        setIsCodeValid(true)
        setCodeMsg('Available')
      } else {
        setIsCodeValid(false)
        setCodeMsg('Not available')
      }
    }

  }

  if (isLoading || batchLoading) return <>...</>

  if (isError || batchError) return <>EEE</>

  return <>
    <div className="mb-10">
      <div className="flex items-center text-sm">
        <div className="flex items-center h-8 bg-gray-500 text-white rounded-l px-3 cursor-default">
          Web Access
        </div>
        <Link href={`/projects/${project._id}/schedules`}>
          <a className="flex items-center bg-gray-100 hover:bg-gray-200 h-8 rounded-r px-4">
            Schedules
          </a>
        </Link>
      </div>
    </div>
    {/* <div className="flex items-centers bg-yellow-50 -mt-px mb-6">
      <div className="flex items-start p-2 bg-yellow-400 text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
      </div>
      <div className="flex-grow px-4 pt-2 pb-3">
        <p className="font-bold text-gray-800 mb-1">
          Batch ini belum siap untuk dideploy
        </p>
        <ul className="list-disc text-sm pl-5">
          {deploymentReqs.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div> */}

    <WebAccess user={user} project={project} batch={batch} mutate={mutate} />

    <h3 className="text-xl font-bold mt-12 mb-1">Test Access</h3>
    <Credentials user={user} batch={batch} batchId={batchId} project={project} />
  </>
}
