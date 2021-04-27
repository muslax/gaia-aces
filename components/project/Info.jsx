import useUsernames from 'hooks/useUsernames';
import { useEffect, useState } from 'react';
import SelectUser from './SelectUser';

const Info = ({ user, project }) => {
  const { users, isLoading, isError } = useUsernames();
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (users) {
      setSelected(users.filter(user => user.username == project.admin.username)[0])
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


  return <>
    {form === 'add-batch' && <>
      <div className="flex flex-col md:flex-row items-center h-auto md:h-16 py-4 md:py-0 border-b border-gray-300">
        <h3 className="text-lgs font-semibold mb-3 md:mb-0">Add new batch</h3>
        {/* <BtnCancel /> */}
        <div className="flex justify-centers ml-6">
          <div className="mr-4">
            <input
              type="text"
              maxLength={24}
              placeholder="Maks. 20 karakter"
              className="rounded border text-sm px-2 py-1 w-52"
            />
          </div>
          <button
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
            className="rounded bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm text-sm text-white font-medium w-20 py-1 mr-3"
          >
            Save
          </button>
          <BtnCancel />
        </div>
      </div>
      {/* <div className="flex justify-center">
        <div className="w-48 mr-4">
          <SelectUser
            users={users}
            value={selected}
            onChange={setSelected}
          />
        </div>
        <button
          className="rounded bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm text-sm text-white font-medium w-20 py-1 mr-3"
        >
          Save
        </button>
        <BtnCancel />
      </div> */}
    </>}
    {form === 'edit-info' && <>
      <div className="flex flex-col md:flex-row items-center h-auto md:h-16 py-4 md:py-0 border-b border-gray-300">
        <h3 className="flex-grows text-lg font-semibold mr-6">Edit project info</h3>
        <BtnCancel />
      </div>
    </>}

    {(!form || form !== 'edit-info') && (
      <>
        {!form && (
          <div className="flex items-center h-16 text-sm text-center md:text-left border-b border-gray-300">
            <BtnAdmin label="Add Batch" onClick={e => setForm('add-batch')} />
            <BtnAdmin label="Change Admin" onClick={e => setForm('change-admin')} />
            <BtnAdmin label="Edit Info" onClick={e => setForm('edit-info')} />
          </div>
        )}
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
      </>
    )}
    {/* <div className="w-48 mr-4">
      <SelectUser
        users={users}
        value={selected}
        onChange={setSelected}
      />
    </div> */}
    <style jsx>{`
    .ff {
      min-width: 160px;
    }
    `}</style>
  </>;
}

export default Info;

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