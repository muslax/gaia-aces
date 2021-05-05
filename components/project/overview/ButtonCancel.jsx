export default function ButtonCancel({ onClick }) {
  return (
    <button
      className={`rounded border text-sm border-green-500
        hover:border-green-600 active:text-green-700 shadow-sm
        text-green-500 hover:text-green-600 font-medium w-20 py-1 mr-3`}
      onClick={onClick}
    >
      Cancel
    </button>
  )
}