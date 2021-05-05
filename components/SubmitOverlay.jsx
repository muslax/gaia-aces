export function Submitting({ message }) {
  return (
    <div className="fixed z-50 w-full h-full top-0 left-0 flex items-center justify-center bg-gray-400 bg-opacity-20">
      <div className="w-72 rounded border border-gray-400 bg-white shadow">
        <h3 className="text-xl mx-4 my-2">{message ? message : 'Submitting'}</h3>
        <div className="progress rounded-b bg-gray-300 h-2"></div>
      </div>
    </div>
  )
}

export function SubmitDone({ message, callback }) {
  return (
    <div className="fixed z-50 w-full h-full top-0 left-0 flex items-center justify-center bg-gray-400 bg-opacity-20">
      <div className="w-72 rounded border border-gray-400 bg-white shadow">
        <h3 className="text-xl mx-4 my-2">{message ? message : 'Done'}</h3>
        <div className="mx-4 my-4 text-center">
          <button
            className="relative w-fulls py-1 px-4 text-left bg-white rounded border border-gray-300 hover:border-gray-400 active:border-gray-500 shadow-sm text-sm"
            onClick={callback}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}