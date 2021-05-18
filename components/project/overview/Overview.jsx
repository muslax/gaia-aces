import { API } from "config";
import { Submitting } from "components/SubmitOverlay";
import useUsernames from "hooks/useUsernames";
import fetchJson from "lib/fetchJson";
import { generatePOSTData } from "lib/utils";
import { useState } from "react";
import { mutate } from "swr";
import FormAdmin from "./FormAdmin";
import FormBatch from "./FormBatch";
import FormInfo from "./FormInfo";

const { default: Batches } = require("./Batches")
const { default: Info } = require("./Info")

export const Overview = ({ user, project }) => {
  const { users, isLoading, isError } = useUsernames();

  const [form, setForm] = useState(null);
  const [modal, setModal] = useState(null);
  const [batchName, setBatchName] = useState('');

  if (isLoading) return null;

  async function changeAdmin(e) {
    setModal('Changing project admin...');
    const url = `/api/post?q=${API.CHANGE_ADMIN}`;
    const body = { id: project._id, username: e.username };
    const res = await fetchJson(url, generatePOSTData(body));

    if (res) {
      mutate(`/api/get?q=${API.GET_PROJECT}&pid=${project._id}`);
    }
    setForm(null);
    setModal(null);
  }

  async function addBatch(e) {
    setModal('Saving new batch...');
    const url = `/api/post?q=${API.ADD_BATCH}`;
    const body = { projectId: project._id, batchName: batchName };
    const response = await fetchJson(url, generatePOSTData(body));

    if (response) {
      mutate(`/api/get?q=${API.GET_PROJECT}&pid=${project._id}`);
    }

    setForm(null);
    setModal(null);
  }

  async function saveInfo(info) {
    setModal('Updating project info...');
    const url = `/api/post?q=${API.UPDATE_PROJECT}`;
    // const body = { projectId: project._id, batchName: batchName };
    const response = await fetchJson(url, generatePOSTData(info));

    if (response) {
      mutate(`/api/get?q=${API.GET_PROJECT}&pid=${project._id}`);
    }

    setForm(null);
    setModal(null);
  }

  return <>
    {!form  && (
      <div className="border-t flex items-center h-16 text-sm text-center md:text-left border-b border-gray-300">
        {user.licenseOwner && user.licenseType == "corporate" && <ButtonAdmin label="Change Admin" onClick={e => setForm('change-admin')} />}
        {user.username == project.admin.username && <>
          {user.licenseType == "corporate" && <ButtonAdmin label="Add Batch" onClick={e => setForm('add-batch')} />}
          <ButtonAdmin label="Edit Info" onClick={e => setForm('edit-info')} />
        </>}
      </div>
    )}
    {form == 'change-admin' && (
      <FormAdmin
        project={project}
        users={users}
        onCancel={e => setForm(null)}
        onSave={e => changeAdmin(e)}
      />
    )}
    {form == 'add-batch' && (
      <FormBatch
        batchName={batchName}
        setBatchName={setBatchName}
        onCancel={e => setForm(null)}
        onSave={e => addBatch(e)}
      />
    )}
    {(!form || form != 'edit-info') && (
      <Info user={user} project={project} />
    )}
    {form == "edit-info" && (
      <FormInfo
        user={user}
        project={project}
        onSave={saveInfo}
        onCancel={e => setForm(null)}
      />
    )}
    <h3 className="text-lg font-bold mt-12 mb-3">Project Batches</h3>
    <Batches project={project} />
    {modal !== null && <Submitting message={modal} />}
    {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    {/* <pre>{JSON.stringify(project, null, 2)}</pre> */}
  </>;
}

function ButtonAdmin({ label, onClick}) {
  return (
    <button
      className="rounded bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm text-white font-medium px-4 py-1 mr-3"
      onClick={onClick}
    >
      {label}
    </button>
  )
}