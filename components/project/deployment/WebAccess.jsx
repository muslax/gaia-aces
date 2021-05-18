import { FormBlock } from "components/form/FormRow"
import { InfoBlock } from "components/form/FormRow"
import fetchJson from "lib/fetchJson"
import { API } from "config"
import { generatePOSTData } from "lib/utils"
import { useEffect, useState } from "react"

export default function WebAccess({ user, project, batch, mutate }) {
  const today = new Date()

  const [token, setToken] = useState(null)
  const [openDate, setOpenDate] = useState('')
  const [openTime, setOpenTime] = useState('')
  const [closeDate, setCloseDate] = useState('')
  const [closeTime, setCloseTime] = useState('')
  const [tokenMsg, setTokenMsg] = useState(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (batch) {
      setToken(batch.accessCode)
      if (batch.dateOpen) {
        const date = new Date(batch.dateOpen)
          setOpenDate(date.toISOString().substr(0, 10))
          setOpenTime(date.toString().substr(16, 5))
      }
      if (batch.dateClosed) {
        const date = new Date(batch.dateClosed)
          setCloseDate(date.toISOString().substr(0, 10))
          setCloseTime(date.toString().substr(16, 5))
      }
    }

  }, [batch])

  async function saveDeployment(e) {
    const url = `/api/post?q=${API.SAVE_DEPLOYMENT}`
    const response = await fetchJson(
      url,
      generatePOSTData({
        code: token,
        openDate: openDate,
        openTime: openTime,
        closeDate: closeDate,
        closeTime: closeTime,
        batchId: batch._id,
      })
    )

    if (response) {
      mutate()
    }

    setEditing(false)
  }

  // if (isError || isLoading) return <>...</>

  const inputClass = `w-40 px-3 h-9 mr-2 text-sm rounded border-gray-300 shadow-sm
  focus:border-blue-400 focus:ring focus:ring-blue-100 focus:ring-opacity-50`

  return <>
    <div className="flex items-center">
      <h3 className="flex-grow text-xl font-bold">Token dan tanggal akses</h3>
      {!editing && (user.username == project.admin.username) && <button
        className="border rounded-sm h-7 px-4 text-sm text-blue-500"
        onClick={e => setEditing(true)}
      >Edit</button>}
    </div>
    {!editing && <>
      <div className="border border-gray-300 px-4 py-2 my-2">
        <InfoBlock label="Token" labelWidth="w-32" value={batch.accessCode ?? 'not set'} valueWidth="w-40" />
        <FormBlock label="Tanggal mulai" labelWidth="w-32">
          <div className="w-32 flex items-center h-9 px-3 bg-gray-100 rounded border border-gray-100">{openDate ? openDate : '-'}</div>
          <span className="mx-2">Pukul</span>
          <div className="w-20 flex items-center h-9 px-3 bg-gray-100 rounded border border-gray-100">{openTime ? openTime : '-'}</div>
          <span className="mx-2">WIB</span>
        </FormBlock>
        <FormBlock label="Tanggal berakhir" labelWidth="w-32">
          <div className="w-32 flex items-center h-9 px-3 bg-gray-100 rounded border border-gray-100">{closeDate ? closeDate : '-'}</div>
          <span className="mx-2">Pukul</span>
          <div className="w-20 flex items-center h-9 px-3 bg-gray-100 rounded border border-gray-100">{closeTime ? closeTime : '-'}</div>
          <span className="mx-2">WIB</span>
        </FormBlock>
        <InfoBlock label="Alamat/URL" labelWidth="w-32" value="http://test.id" />
      </div>
    </>}
    {editing && <>
      <div className="border border-gray-300 px-4 py-2 my-2">
        <FormBlock label="Token" labelWidth="w-32">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="5-20 karakter"
              minLength="5"
              maxLength="20"
              value={token}
              // onChange={checkToken}
              onChange={e => setToken(e.target.value)}
              className={`w-40 ${inputClass}`}
            />
          </div>
          <div className="pb-1">
            <button onClick={e => setEditing(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </FormBlock>
        <FormBlock label="Tanggal mulai" labelWidth="w-32">
          <input
            type="date"
            maxLength="10"
            autoFocus={true}
            value={openDate}
            min={today.toISOString().substr(0, 10)}
            onChange={e => setOpenDate(e.target.value)}
            className={`w-40 ${inputClass}`}
          />
          <input
            type="time"
            maxLength="5"
            value={openTime ? openTime : "07:00"}
            onChange={e => setOpenTime(e.target.value)}
            className={`w-24 ${inputClass}`}
          />
          <span className="">WIB</span>
        </FormBlock>
        <FormBlock label="Tanggal berakhir" labelWidth="w-32">
          <input
            type="date"
            maxLength="10"
            value={closeDate}
            min={today.toISOString().substr(0, 10)}
            onChange={e => setCloseDate(e.target.value)}
            className={`w-40 ${inputClass}`}
          />
          <input
            type="time"
            maxLength="5"
            value={closeTime ? closeTime : '17:00'}
            onChange={e => setCloseTime(e.target.value)}
            className={`w-24 ${inputClass}`}
          />
          <span className="">WIB</span>
        </FormBlock>
        <FormBlock label="" labelWidth="w-32">
          <button
            className={`
            w-24 px-3 h-9 text-sm font-medium rounded border border-gray-400 hover:border-gray-500 shadow-sm
            focus:border-indigo-400 focus:ring focus:ring-indigo-100 focus:ring-opacity-50
            `}
            onClick={saveDeployment}
          >Save</button>
        </FormBlock>
      </div>
    </>}


    {/* <pre>{JSON.stringify(batch, null, 2)}</pre> */}
    {/* <style jsx>{`
    input:disabled,
    input[type='time']:disabled {
      color: red;
      border-color: rgba(243, 244, 246, 1);
      background-color: rgba(243, 244, 246, 1);
      box-shadow: none;
    }
    `}</style> */}
  </>
}