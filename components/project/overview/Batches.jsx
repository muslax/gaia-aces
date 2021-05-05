export default function Batches({ project }) {
  return <table className="w-full text-sm">
    <tbody>
      <tr className="border-b border-gray-300 text-gray-500">
        <td className="p-3 pl-0">Batch</td>
        <td className="hidden sm:table-cell p-3 text-center">Modules</td>
        <td className="p-3">Mulai</td>
        <td className="p-3">Selesai</td>
        <td className="hidden sm:table-cell p-3">Token</td>
      </tr>
      {project.batches.map((batch, index) => (
        <tr key={batch._id} className="border-b font-semibold">
          <td className="p-3 pl-0 whitespace-nowrap">{batch.batchName}</td>
          <td className="hidden sm:table-cell p-3 text-center">{batch.modules.length}</td>
          <td className="p-3 whitespace-nowrap">{batch.dateOpen ? new Date(batch.dateOpen).toLocaleString('id') : '-'}</td>
          <td className="p-3 whitespace-nowrap">{batch.dateClosed ? new Date(batch.dateClosed).toLocaleString('id') : '-'}</td>
          <td className="hidden sm:table-cell p-3">{batch.accessCode}</td>
        </tr>
      ))}
    </tbody>
  </table>
}