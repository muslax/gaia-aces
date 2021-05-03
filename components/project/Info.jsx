import useUsernames from 'hooks/useUsernames';
import fetchJson from 'lib/fetchJson';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import SelectUser from './SelectUser';

const Info = ({ user, project }) => {
  const { users, isLoading, isError } = useUsernames();
  const [prevAdmin, setPrevAdmin] = useState(null);
  const [selected, setSelected] = useState(null);
  const [newBatchName, setNewBatchName] = useState('')
  const [form, setForm] = useState(null);
  const [modal, setModal] = useState(null)

  const [title, setTitle] = useState(project.title);
  const [fullTitle, setFullTitle] = useState(project.fullTitle);
  const [description, setDescription] = useState(project.description);
  const [startDate, setStartDate] = useState(project.startDate);
  const [endDate, setEndDate] = useState(project.endDate);

  useEffect(() => {
    if (users) {
      const admin = users.filter(user => user.username == project.admin.username)[0];
      setSelected(admin);
      setPrevAdmin(admin);
    }
  }, [users])

  if (isLoading || !selected) return null;

  function BtnCancel() {
    return (
      <button
        className="rounded border text-sm border-green-500 hover:border-green-600 active:text-green-700 shadow-sm text-green-500 hover:text-green-600 font-medium w-20 py-1 mr-3"
        onClick={e => setForm(null)}
      >
        Cancel
      </button>
    )
  }

  function BtnAdmin({ label, onClick}) {
    return (
      <button
        className="rounded bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm text-white font-medium px-4 py-1 mr-3"
        onClick={onClick}
      >
        {label}
      </button>
    )
  }

  async function changeAdmin(e) {
    setModal('Changing project admin...');
    const url = '/api/post?q=change-admin';
    console.log(selected)
    const body = { id: project._id, username: selected.username };
    console.log(body);
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (response) {
      console.log(response);
      mutate(`/api/get?q=get-project-header&pid=${project._id}`);
    }

    setForm(null);
    setModal(null);
  }

  async function addBatch(e) {
    setModal('Saving new batch...');
    const url = '/api/post?q=add-batch';
    console.log(selected)
    const body = { projectId: project._id, batchName: newBatchName };
    console.log(body);
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (response) {
      console.log(response);
      mutate(`/api/get?q=get-project-header&pid=${project._id}`);
    }

    setForm(null);
    setModal(null);
  }


  return <>
    {/* <pre>{JSON.stringify(selected, null, 2)}</pre> */}
    {form === 'add-batch' && <>
      <div className="flex flex-col md:flex-row items-center h-auto md:h-16 py-4 md:py-0 border-b border-gray-300">
        <h3 className="text-lgs font-semibold mb-3 md:mb-0">Add new batch</h3>
        {/* <BtnCancel /> */}
        <div className="flex justify-centers ml-6">
          <div className="mr-4">
            <input
              type="text"
              maxLength={20}
              placeholder="Maks. 20 karakter"
              value={newBatchName}
              onChange={e => setNewBatchName(e.target.value)}
              className="rounded border text-sm px-2 py-1 w-52"
            />
          </div>
          <button
            disabled={newBatchName.length < 5}
            onClick={addBatch}
            className="rounded bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm text-sm text-white font-medium w-20 py-1 mr-3"
          >
            Save
          </button>
          <BtnCancel />
        </div>
      </div>
    </>}
    {form === 'change-admin' && <>
      <div className="flex flex-col md:flex-row items-center h-auto md:h-16 py-4 md:py-0 border-b border-gray-300">
        <h3 className="text-lgs font-semibold mb-3 md:mb-0">Change admin</h3>
        {/* <BtnCancel /> */}
        <div className="flex justify-centers ml-6">
          <div className="w-48 mr-4">
            <SelectUser
              users={users}
              value={selected}
              onChange={setSelected}
            />
          </div>
          <button
            disabled={selected.username == prevAdmin.username}
            className="rounded bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm text-sm text-white font-medium w-20 py-1 mr-3"
            onClick={changeAdmin}
          >
            Save
          </button>
          <BtnCancel />
        </div>
      </div>
    </>}
    {form === 'edit-info' && <>
      <div className="flex flex-col md:flex-row items-center h-auto md:h-16 py-4 md:py-0">
        <h3 className="flex-grows text-lg font-semibold mr-6">Edit project info</h3>
        <BtnCancel />
      </div>
    </>}
    {form === 'edit-info' && <>
      <div className="rounded-md border border-gray-300 pt-3 pb-2">
        <FormRow label="Judul proyek" value={title} onChange={e => setTitle(e.target.value)} />
        <FormRow label="Judul lengkap" value={fullTitle} onChange={e => setFullTitle(e.target.value)} />
        <FormRow label="Deskripsi" value={description} onChange={e => setDescription(e.target.value)} />
        <FormRow label="Tgl mulai kontrak" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <FormRow label="Tgl berakhir kontrak" value={endDate} onChange={e => setEndDate(e.target.value)} />

      </div>
    </>}

    {(!form || form !== 'edit-info') && (
      <>
        {user.licenseType == 'personal' && (
          <div className="flex items-center h-16 text-sm text-center md:text-left border-b border-gray-300">
            <BtnAdmin label="Edit Info" onClick={e => setForm('edit-info')} />
          </div>
        )}
        {!form && user.licenseType == 'corporate' && (user.licenseOwner || user.username == project.admin.username) && (
          <div className="flex items-center h-16 text-sm text-center md:text-left border-b border-gray-300">
            {user.licenseOwner && <BtnAdmin label="Change Admin" onClick={e => setForm('change-admin')} />}
            {user.username == project.admin.username && <>
              <BtnAdmin label="Add Batch" onClick={e => setForm('add-batch')} />
              <BtnAdmin label="Edit Info" onClick={e => setForm('edit-info')} />
            </>}
          </div>
        )}
        {/* <Row label="Batch" content={window.localStorage.getItem('batch')} /> */}
        <Row label="ID Proyek" content={project._id} />
        <Row label="Judul" content={project.title} />
        <Row label="Judul lengkap" content={project.fullTitle} />
        <Row label="Deskripsi" content={project.description} truncate/>
        <Row label="Tanggal mulai kontrak" content={project.startDate} />
        <Row label="Tanggal akhir kontrak" content={project.endDate} />
        <Row label="Tipe proyek" content={`${project.batchMode}-batch`} />
        <div className="flex items-center text-sm border-b py-2">
          <div className="w-1/4 ff flex-shrink-0 text-gray-500">
            <span className="px-2 py-1 block">Admin</span>
          </div>
          <div className="flex-grow text-gray-800 font-medium">
            <div className="px-2 py-1">{project.admin.fullname}</div>
          </div>
        </div>
        {/* <pre>{JSON.stringify(project, null, 2)}</pre> */}
      </>
    )}
    {modal && (
      <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center bg-gray-400 bg-opacity-20">
        <div className="w-72 rounded border border-gray-400 bg-white shadow">
          <h3 className="text-xl mx-4 my-2">{modal}</h3>
          <div className="progress rounded-b bg-gray-300 h-2"></div>
        </div>
      </div>
    )}
    <style jsx>{`
    .ff {
      min-width: 160px;
    }
    .progress {
      background-image: url(/mango-in-progress-01.gif);
    }
    `}</style>
  </>;
}

export default Info;


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


function Row ({ label, content, truncate = true }) {
  return (
    <div className="flex items-center text-sm border-b py-2">
      <div className="w-1/4 ff flex-shrink-0 text-gray-500">
        <span className="px-2 py-1 block truncate">{label}</span>
      </div>
      <div className="flex-grow overflow-hidden text-gray-800 font-medium">
        <div className={`px-2 py-1 ${truncate ? 'truncate' : ''}`}>{content}</div>
      </div>
      <style jsx>{`
    .ff {
      min-width: 140px;
    }
    `}</style>
    </div>
  )
}