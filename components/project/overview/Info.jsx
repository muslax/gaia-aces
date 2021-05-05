const Info = ({ project }) => {
  return <div className="mb-6">
    <Row label="ID Proyek" content={project._id} />
    <Row label="Klien" content={project.client.name} />
    <Row label="Judul" content={project.title} />
    <Row label="Judul lengkap" content={project.fullTitle} />
    <Row label="Deskripsi" content={project.description} truncate/>
    <Row label="Tanggal mulai kontrak" content={project.startDate} />
    <Row label="Tanggal akhir kontrak" content={project.endDate} />
    <Row label="Tipe proyek" content={`${project.batchMode}-batch`} />
    <Row label="Admin" content={project.admin.fullname} />
  </div>;
}

export default Info;

function Row ({ label, content }) {
  return (
    <div className="flex items-center text-sm border-b py-2">
      <div className="w-1/4 ff flex-shrink-0 text-gray-500">
        <span className="pr-2 py-1 block truncate">{label}</span>
      </div>
      <div className="flex-grow overflow-hidden text-gray-800s font-medium">
        <div className={`px-2 py-1 truncate`}>{content}</div>
      </div>
      <style jsx>{`
      .ff {
        min-width: 140px;
      }
    `}</style>
    </div>
  )
}