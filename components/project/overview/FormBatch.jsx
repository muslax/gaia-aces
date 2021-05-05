import ButtonCancel from "./ButtonCancel";

export default function FormBatch({ batchName, setBatchName, onCancel, onSave }) {

  return (
    <div className="border-t flex flex-col md:flex-row items-center h-auto md:h-16 py-4 md:py-0 border-b border-gray-300">
      <h3 className="text-lgs font-semibold mb-3 md:mb-0">Add new batch</h3>
      <div className="flex justify-centers ml-6">
        <div className="mr-4">
          <input
            type="text"
            maxLength={20}
            autoFocus
            placeholder="Maks. 20 karakter"
            value={batchName}
            onChange={e => setBatchName(e.target.value)}
            className={`rounded border shadow-sm text-sm px-2 py-1 w-52 border-gray-300
            focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50
            `}
          />
        </div>
        <button
          disabled={batchName.length < 5}
          onClick={onSave}
          className="rounded bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm text-sm text-white font-medium w-20 py-1 mr-3"
        >
          Save
        </button>
        <ButtonCancel onClick={onCancel} />
      </div>
    </div>
  )
}