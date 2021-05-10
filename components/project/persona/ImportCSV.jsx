import { API } from "config";
import { SubmitDone } from "components/SubmitOverlay";
import { Submitting } from "components/SubmitOverlay";
import useWorkbook from "hooks/useWorkbook";
import fetchJson from "lib/fetchJson";
import { getLastVisitedBatchId } from "lib/storage";
import { generatePOSTData, getBatch } from "lib/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CSVReader } from "react-papaparse";
import { TableCSV } from "./TableCSV";

const buttonRef = React.createRef()

export const ImportCSV = ({ user, project }) => {
  const router = useRouter();
  const batchId = getLastVisitedBatchId(project);
  const batch = getBatch(batchId, project);
  const { workbook, isError, isLoading } = useWorkbook();

  const [testIds, setTestIds] = useState([]);
  const [simIds, setSimIds] = useState([]);
  const [csvData, setCsvData] = useState(null);
  const [personaData, setPersonaData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [hashing, sethashing] = useState(false);
  const [hashingFlag, setHashingFlag] = useState(false);

  async function handleSubmit(e) {
    setSubmitting(true);

    const body = { personae: personaData };
    const res = await fetchJson(
      `/api/post?q=${API.SAVE_CSV_DATA}`,
      generatePOSTData(body)
    );

    if (res) {
      setSubmitting(false);
      setDone(true);
    }
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
        // Tests and sims format
        // <moduleId>: [ <module.lngth>, 0 ]
        // "608b29105959bf263a6ecce0": [ 45, 0 ]
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
            workingOn: null,
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
              {personaData.length == 0 && <button
                disabled={submitting}
                className="bg-white inline-flex text-sm px-3 py-1 ml-3 text-gray-400 rounded border border-gray-300"
              >
                Remove
              </button>}
              {personaData.length > 0 && <button
                type="button"
                disabled={submitting}
                onClick={handleRemoveFile}
                className="bg-white inline-flex text-sm px-3 py-1 ml-3 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                Remove
              </button>}
            </div>
            <div className="flex items-center rounded-r-md bg-gray-100 px-3 py-3 -mt-1 mb-5 border-l border-gray-300">
              {personaData.length == 0 && <button
                disabled
                className="bg-white inline-flex text-sm px-3 py-1 text-gray-400 rounded border border-gray-300"
              >
                Save<span className="hidden sm:inline"> CSV Data</span>
              </button>}
              {personaData.length > 0 && <button
                type="button"
                disabled={submitting || personaData.length == 0}
                onClick={handleSubmit}
                className="bg-white inline-flex text-sm px-3 py-1 focus:outline-none hover:shadow rounded border border-gray-300 hover:border-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                Save<span className="hidden sm:inline"> CSV Data</span>
              </button>}
              <button
                type="button"
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
      {/* Batch {JSON.stringify(batch, null, 2)}<br/> */}
      {/* CSVData {JSON.stringify(csvData, null, 2)}<br/> */}
      {/* Persona {JSON.stringify(personaData, null, 2)}<br/> */}
      {/* Workbook {JSON.stringify(testIds, null, 2)}<br/> */}
    </pre>
    {submitting && <Submitting message="Saving CSV data" />}
    {done && <SubmitDone message="Data saved" callback={e => router.push(`/projects/${project._id}/persona`)} />}
  </>;
}
