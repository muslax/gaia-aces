import { API } from "config";
import useWorkbook from "hooks/useWorkbook";
import fetchJson from "lib/fetchJson";
import { getLastVisitedBatchId }from  "lib/storage";
import { getBatch } from "lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { mutate } from "swr";

export const Deployment = ({ user, project }) => {
  const batchId = getLastVisitedBatchId(project);
  const batch = getBatch(batchId, project);
  const { workbook, isError, isLoading } = useWorkbook();
  const [deploymentReqs, setDeploymentReqs] = useState([]);
  const [depStatus, setDepStatus] = useState(null);

  const today = new Date();
  const [code, setCode] = useState(batch.accessCode || '');
  const [isCodeValid, setIsCodeValid] = useState(batch.accessCode || false)
  const [codeMsg, setCodeMsg] = useState('')

  const [openDate, setOpenDate] = useState('');
  const [openTime, setOpenTime] = useState('07:00');
  const [closeDate, setCloseDate] = useState('');
  const [closeTime, setCloseTime] = useState('17:00');


  // Check wether batch
  useEffect(() => {
    if (batch && workbook) {
      setCode(batch.accessCode);

      const array = [];
      if (batch.personae === 0) {
        array.push('Belum ada daftar persona.');
      }

      workbook.modules.filter(mod => mod.method == 'guided').forEach(mod => {
        if (batch.modules.includes(mod.moduleId)) {
          array.push(`Module ${mod.title} memerlukan penjadwalan`);
        }
      })

      setDeploymentReqs(array);

      if (batch.dateOpen !== null) {
        const date = new Date(batch.dateOpen);
        setOpenDate(date.toISOString().substr(0, 10));
        setOpenTime(date.toString().substr(16, 5));
      }

      if (batch.dateClosed !== null) {
        const date = new Date(batch.dateClosed);
        setCloseDate(date.toISOString().substr(0, 10));
        setCloseTime(date.toString().substr(16, 5));
      }
    }
  }, [batch, workbook])

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

  if (isLoading) return <>...</>;

  if (isError) return <>EEE</>; // <ErrorPage title="Something" code={batchId} message="Not Found" />


  async function saveDeployment(e) {
    const url = `/api/post?q=${API.SAVE_DEPLOYMENT}`;
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        code: code,
        openDate: openDate,
        openTime: openTime,
        closeDate: closeDate,
        closeTime: closeTime,
        batchId: batchId,
      })
    })

    if (response) {
      mutate(`/api/get?q=get-batch&bid=${batchId}`)
    }
  }

  return <>
    {!isDeployable() && (
      <div className="flex items-centers bg-yellow-50 -mt-px mb-6">
        <div className="flex items-start p-2 bg-yellow-400 text-red-600">
          {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg> */}
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
      </div>
    )}

    <h3 className="text-xl font-bold mb-2">Kode akses dan waktu</h3>
    <p className="text-sm text-gray-500 mb-2">
      Waktu dalam WIB. {openDate}:{openTime} -- {closeDate}:{closeTime} {code}
    </p>

    <div className="w-auto border border-gray-300 pt-2 pb-2">
      <div className="flex items-center text-sm px-4">
        <div className="w-1/4 ff flex-shrink-0 text-gray-500">
          <span className="py-2 pr-2 block truncate">Kode akses:</span>
        </div>
        <div className="flex-grow text-gray-800s font-medium">
          <div className="px-3 py-2">
            <input
              type="text"
              disabled={batch.accessCode && batch.accessCode?.length > 4}
              placeholder="5-20 karakter"
              minLength="5"
              maxLength="20"
              value={code}
              onChange={checkToken}
              className={`
              w-44 px-3 h-9 text-sm font-medium rounded border-gray-300 shadow-sm
              focus:border-indigo-400 focus:ring focus:ring-indigo-100 focus:ring-opacity-50
              `}
            />
            {codeMsg && !isCodeValid && <span className="text-sm text-red-500 ml-4">{codeMsg}</span>}
            {codeMsg && isCodeValid && <span className="text-sm text-green-500 ml-4">{codeMsg}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center text-sm px-4">
        <div className="w-1/4 ff flex-shrink-0 text-gray-500">
          <span className="py-2 pr-2 block truncate">Tanggal mulai:</span>
        </div>
        <div className="flex-grow text-gray-800s font-medium">
          <div className="flex items-center px-3 py-2">
            <input
              type="date"
              maxLength="10"
              value={openDate}
              min={today.toISOString().substr(0, 10)}
              onChange={e => setOpenDate(e.target.value)}
              className={`
              w-40 px-3 h-9 text-sm font-medium rounded border-gray-300 shadow-sm
              focus:border-indigo-400 focus:ring focus:ring-indigo-100 focus:ring-opacity-50
              `}
            />
            <input
              type="time"
              maxLength="5"
              value={openTime}
              onChange={e => setOpenTime(e.target.value)}
              className={`
              w-24 px-3 h-9 ml-2 text-sm font-medium rounded border-gray-300 shadow-sm
              focus:border-indigo-400 focus:ring focus:ring-indigo-100 focus:ring-opacity-50
              `}
            />
            <span className="ml-2 font-bold">WIB</span>
            {/* <span className="ml-4">{openDate} - {openTime}</span> */}
          </div>
        </div>
      </div>

      <div className="flex items-center text-sm px-4">
        <div className="w-1/4 ff flex-shrink-0 text-gray-500">
          <span className="py-2 pr-2 block truncate">Tanggal berakhir:</span>
        </div>
        <div className="flex-grow text-gray-800s font-medium">
          <div className="flex items-center px-3 py-2">
            <input
              type="date"
              maxLength="5"
              value={closeDate}
              placeholder="dd-mm-yyyy"
              onChange={e => setCloseDate(e.target.value)}
              className={`
              w-40 px-3 h-9 text-sm font-medium rounded border-gray-300 shadow-sm
              focus:border-indigo-400 focus:ring focus:ring-indigo-100 focus:ring-opacity-50
              `}
            />
            <input
              type="time"
              maxLength="5"
              value={closeTime}
              onChange={e => setCloseTime(e.target.value)}
              className={`
              w-24 px-3 h-9 ml-2 text-sm font-medium rounded border-gray-300 shadow-sm
              focus:border-indigo-400 focus:ring focus:ring-indigo-100 focus:ring-opacity-50
              `}
            />
            <span className="ml-2 font-bold">WIB</span>
          </div>
        </div>
      </div>

      <div className="flex items-center text-sm px-4">
        <div className="w-1/4 ff flex-shrink-0 text-gray-500">
          {/* <span className="py-2 pr-2 block truncate">Tanggal berakhir:</span> */}
        </div>
        <div className="flex-grow text-gray-800s font-medium">
          <div className="flex px-3 py-2">
            {(isCodeValid || batch.accessCode) && <button
              className={`
              w-24 px-3 h-9 text-sm font-medium rounded border border-gray-400 hover:border-gray-500 shadow-sm
              focus:border-indigo-400 focus:ring focus:ring-indigo-100 focus:ring-opacity-50
              `}
              onClick={saveDeployment}
            >Save</button>}
            {!isCodeValid && <button disabled
              className={`
              w-24 px-3 h-9 text-sm text-gray-300 font-medium rounded border border-gray-300 shadow-sms`}
            >Save</button>}
          </div>
        </div>
      </div>

    </div>

    <h3 className="text-xl font-bold mt-5 mb-1">Jadwal tatap muka</h3>
    <p className="text-sm text-gray-500">
      Batch ini tidak memerlukan penjadwalan.
    </p>
    <p className="text-sm text-gray-500">
      Batch ini memerlukan penjadwalan, tetapi belum dibuat.{` `}
      <Link href={`/projects/${project._id}/schedules`}>
        <a className="text-blue-500 hover:underline">
          Klik di sini untuk melakukan penjadwalan
        </a>
      </Link>.
    </p>


    <h3 className="text-xl font-bold mt-5 mb-1">User Access</h3>
    <p className="text-sm text-gray-500">
      Belum ada daftar persona &ndash; belum dapat membuat kredensial.{` `}
      <Link href={`/projects/${project._id}/access`}>
        <a className="text-blue-500 hover:underline">
          (Ke halaman User Access)
        </a>
      </Link>.
    </p>


    <pre> {JSON.stringify(batch, null, 2)} </pre>
    {/* <pre> {JSON.stringify(workbook, null, 2)} </pre> */}
    <style jsx>{`
    input::placeholder {
      color: #ccc;
    }
    `}</style>
  </>
}


function FormRow ({ label, value, onChange }) {
  return (
    <div className="flex items-center text-sm border-bs mb-1">
      <div className="w-1/4 ff flex-shrink-0 text-gray-500">
        <span className="pl-3 py-2 block truncate">{label}</span>
      </div>
      <div className="flex-grow text-gray-800 font-medium">
        <div className="px-3 py-2">
          <input
            type="text"
            value={value}
            onChange={onChange}
            className={`
            w-full px-3 py-2 text-sm font-medium rounded border-gray-300 shadow-sm
            focus:border-green-400 focus:ring focus:ring-gray-200 focus:ring-opacity-50
            `}
          />
        </div>
      </div>
    </div>
  )
}