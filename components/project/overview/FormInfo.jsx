import { useState } from "react"
import ButtonCancel from './ButtonCancel'

const inputClass = `px-3 py-2 text-sm font-medium rounded border-gray-300 shadow-sm
focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`

function FormRow ({ label, value, disabled, onChange }) {
  return (
    <div className="flex items-center text-sm">
      <div className="w-1/4 ff flex-shrink-0 text-gray-500">
        <span className="pl-4 py-2 block truncate">{label}</span>
      </div>
      <div className="flex-grow text-gray-800s font-medium">
        <div className="px-4 py-1">
          {!disabled && <input
            type="text"
            value={value}
            onChange={onChange}
            className={`w-full ${inputClass}`}
          />}
          {disabled && <input
            type="text"
            value={value}
            disabled
            className={`w-full ${inputClass}`}
          />}
        </div>
      </div>
      <style jsx>{`
      input:disabled {
        color: #bbb;
      }
      `}</style>
    </div>
  )
}

function DateInfo ({ label, value, onChange }) {
  return (
    <div className="flex items-center text-sm">
      <div className="w-1/4 ff flex-shrink-0 text-gray-500">
        <span className="pl-4 py-2 block truncate">{label}</span>
      </div>
      <div className="flex-grow text-gray-800s font-medium">
        <div className="px-4 py-1">
          <input
            type="date"
            value={value}
            maxLength="10"
            className={`w-36 ${inputClass}`}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  )
}

export default function FormInfo({ project, onSave, onCancel }) {
  const [title, setTitle] = useState(project.title);
  const [fullTitle, setFullTitle] = useState(project.fullTitle);
  const [description, setDescription] = useState(project.description);
  const [startDate, setStartDate] = useState(project.startDate);
  const [endDate, setEndDate] = useState(project.endDate);

  return <div>
    <div className="border-t border-gray-300 flex flex-col md:flex-row items-center h-auto md:h-16 py-4 md:py-0">
      <h3 className="flex-grows text-lg font-semibold mr-6">Edit project info</h3>
      <ButtonCancel onClick={onCancel} />
    </div>
    <div className="rounded border border-gray-300 pt-3 pb-2 mb-6">
      <FormRow label="ID Proyek" value={project._id} disabled />
      <FormRow label="Klien" value={project.client.name} disabled />
      <FormRow label="Judul proyek" value={title} onChange={e => setTitle(e.target.value)} />
      <FormRow label="Judul lengkap" value={fullTitle} onChange={e => setFullTitle(e.target.value)} />
      <div className="flex items-center text-sm">
        <div className="w-1/4 ff flex-shrink-0 text-gray-500">
          <span className="pl-4 py-2 block truncate">Deskripsi</span>
        </div>
        <div className="flex-grow text-gray-800s font-medium">
          <div className="px-4 py-1">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={`w-full ${inputClass}`}
            ></textarea>
          </div>
        </div>
      </div>
      <DateInfo label="Tgl mulai kontrak" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <DateInfo label="Tgl berakhir kontrak" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <div className="flex items-center text-sm">
        <div className="w-1/4 ff flex-shrink-0 text-gray-500"></div>
        <div className="flex-grow text-gray-800s font-medium">
          <div className="px-4 py-3">
            <button
              className="w-36 rounded bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm text-white font-medium py-2 mr-3"
              onClick={e => onSave({
                projectId: project._id,
                title: title,
                fullTitle: fullTitle,
                description: description,
                startDate: startDate,
                endDate: endDate,
              })}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
}