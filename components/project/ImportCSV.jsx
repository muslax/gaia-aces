import { API } from "config";
import useWorkbook from "hooks/useWorkbook";
import fetchJson from "lib/fetchJson";
import { getLastVisitedBatchId } from "lib/storage";
import { generatePOSTData, getBatch } from "lib/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CSVReader } from "react-papaparse";

const buttonRef = React.createRef()

const ImportCSV = ({ user, project }) => {
  const router = useRouter();
  const batchId = getLastVisitedBatchId(project);
  const batch = getBatch(batchId, project);
  const { workbook, isError, isLoading } = useWorkbook();

  const [testIds, setTestIds] = useState([]);
  const [simIds, setSimIds] = useState([]);
  const [csvData, setCsvData] = useState(null);
  const [personaData, setPersonaData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [hashing, sethashing] = useState(false);
  const [hashingFlag, setHashingFlag] = useState(false);

  const generateHashOnServer = async () => {
    // sethashing(true)
    // const url = '/api/post?q=check-and-prepare-csv'
    // const response = await fetchJson(url, {
    //   method: 'POST',
    //   headers: { 'Content-type': 'application/json' },
    //   body: JSON.stringify(personaData)
    // })

    // if (response) {
    //   setPersonaData(response)
    //   sethashing(false)
    // } else {
    //   // setResponse('FAILED')
    // }
  }

  async function handleSubmit(e) {
    setSubmitting(true);

    const body = { personae: personaData };
    const res = await fetchJson(
      API.SAVE_CSV_DATA,
      generatePOSTData(body)
    );
  }


  function handleOnFileLoad(data) {
    populate(data)
  }

  function handleOnError(err, file, inputElem, reason) {
    console.log(err);
  }

  function handleOnRemoveFile(data) {
    reset()
    console.log(data);
  }

  function handleOpenDialog (e) {
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  function handleRemoveFile(e) {
    document.querySelectorAll('input[type="checkbox]').forEach(elm => {
      elm.checked = true
    })

    document.querySelectorAll('.col-email, .col-gender, .col-birth, .col-phone, .col-nip, .col-position').forEach(elm => {
      elm.classList.remove('hidden')
    })

    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  }

  function populate (data) {
    setCsvData(data)
  }

  function reset () {
    setCsvData(null)
    setPersonaData([])
  }

  useEffect(() => {
    const tests = [];
    const sims = [];
    workbook.modules.forEach(mod => {
      if (batch.modules.includes(mod.moduleId)) {
        let obj = {};
        obj[mod.moduleId] = [mod.length, 0];
        if (mod.method == 'selftest') {
          tests.push(obj);
        } else if (mod.method == 'guided') {
          sims.push(obj);
        }
      }
    })

    setTestIds(tests);
    setSimIds(sims);

    return () => {}
  }, [batch, workbook])

  useEffect(() => {
    if (csvData && csvData.length > 1) {
      let array = []
      csvData.forEach(({ data }, index) => {
        if (data.length == 10 && data[0] && data[0].toLowerCase() !== 'fullname') {
          array.push({
            _id: null,
            licenseId: user.licenseId,
            projectId: project._id,
            batchId: batch._id,
            disabled: false,
            fullname: data[0].trim(),
            username: data[1].trim().toLowerCase(),
            email: data[2].trim().toLowerCase(),
            gender: data[3].trim(),
            birth: data[4].trim(),
            phone: data[5].trim(),
            nip: data[6].trim(),
            position: data[7].trim(),
            currentLevel: data[8].trim(),
            targetLevel: data[9].trim(),
            // simGroup: null,
            tests: testIds,
            sims: simIds,
            onGoing: null,
            // currentSim: null,
            // testsPerformed: [],
            // simsPerformed: [],
            xfpwd: null,
            hashed_password: null,
            createdBy: user.username,
            createdAt: new Date(),
            updatedAt: null,
          })
        }
      })

      setPersonaData(array)
      setHashingFlag(!hashingFlag)
    } else {
      setPersonaData([])
    }
    return () => {}
  }, [csvData]);

  if (isLoading) return <>...</>;


  return <>
    <div className="">
      <CSVReader
        ref={buttonRef}
        onFileLoad={handleOnFileLoad}
        onError={handleOnError}
        noClick
        noDrag
        noProgressBar
        onRemoveFile={handleOnRemoveFile}
      >
        {({ file }) => (
          <>
          <div className="flex flex-row items-centers pb-1">
            <div className="flex-grow flex items-center rounded-l-md bg-gray-100 px-3 py-3 -mt-1 mb-5">
              <div className="flex-grow bg-white border border-gray-300 text-sm px-2 py-1">
                File:&nbsp; {(file && file.name) || '...'}
              </div>
              {personaData.length == 0 && <button
                type="button"
                disabled={submitting}
                onClick={handleOpenDialog}
                className="bg-white whitespace-nowrap text-sm px-3 py-1 ml-3 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                Pilih file
              </button>}
              {personaData.length > 0 &&<button
                disabled={submitting}
                className="bg-white inline-flex text-sm px-3 py-1 ml-3 text-gray-400 rounded border border-gray-300"
              >
                Pilih file
              </button>}
              {submitting || personaData.length == 0 && <button
                disabled={submitting}
                className="bg-white inline-flex text-sm px-3 py-1 ml-3 text-gray-400 rounded border border-gray-300"
              >
                Remove
              </button>}
              {!submitting && personaData.length > 0 && <button
                type="button"
                disabled={submitting}
                onClick={handleRemoveFile}
                className="bg-white inline-flex text-sm px-3 py-1 ml-3 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                Remove
              </button>}
            </div>
            <div className="flex items-center rounded-r-md bg-gray-100 px-3 py-3 -mt-1 mb-5 border-l border-gray-300">
              {submitting || personaData.length == 0 && <button
                disabled
                className="bg-white inline-flex text-sm px-3 py-1 text-gray-400 rounded border border-gray-300"
              >
                Save<span className="hidden sm:inline"> CSV Data</span>
              </button>}
              {!submitting && personaData.length > 0 && <button
                type="button"
                disabled={submitting || personaData.length == 0}
                onClick={handleSubmit}
                className="bg-white inline-flex text-sm px-3 py-1 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                Save<span className="hidden sm:inline"> CSV Data</span>
              </button>}
              <button
                type="button"
                disabled={submitting}
                onClick={e => {
                  router.push(`/projects/${project._id}/persona`)
                }}
                className="bg-white inline-flex text-sm px-3 py-1 ml-3 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
          </>
        )}
      </CSVReader>
    </div>
    <div className="relative overflow-x-scroll border border-gray-400">
      <TableCSV data={personaData} />
    </div>
    <pre>
      Batch {JSON.stringify(batch, null, 2)}<br/>
      {/* CSVData {JSON.stringify(csvData, null, 2)}<br/> */}
      Persona {JSON.stringify(personaData, null, 2)}<br/>
      Workbook {JSON.stringify(workbook, null, 2)}<br/>
    </pre>
    <style jsx>{`

    `}</style>
  </>;
}

export default ImportCSV;

function TableCSV({ data }) {
  return (
    <table className="w-full text-xs whitespace-nowrap">
      <thead>
        <tr className="bg-gray-200 text-xs uppercase text-gray-600">
          <td className="h-7 px-2 py-1 text-right">##</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">fullname</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">username</td>
          <td className="col-email h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">email</td>
          <td className="col-gender h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">l/p</td>
          <td className="col-birth h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">birth</td>
          <td className="col-phone h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">phone</td>
          <td className="col-nip h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">nip</td>
          <td className="col-position h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">position</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">c-Level</td>
          <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">t-Level</td>
        </tr>
        {data.length > 0 && <tr>
          <td colSpan="11" className="h-0 p-0 bg-gray-400 border-t border-gray-400"></td>
        </tr>}
      </thead>
      <tbody>
      {data.map(({
        fullname,
        username,
        email,
        gender,
        birth,
        phone,
        nip,
        position,
        currentLevel,
        targetLevel,
        xfpwd }, index) => (
          <tr key={email} className={`bg-white border-b`}>
            <td className="h-7 px-2 py-1 text-right">{index + 1}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{fullname}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{username}</td>
            <td className="col-email h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{email}</td>
            <td className="col-gender h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{gender}</td>
            <td className="col-birth h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{birth}</td>
            <td className="col-phone h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{phone}</td>
            <td className="col-nip h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{nip}</td>
            <td className="col-position h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{position}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{currentLevel}</td>
            <td className="h-7 px-2 py-1 border-l border-gray-400 border-opacity-25">{targetLevel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}