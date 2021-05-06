import Link from "next/link";

export default function ModulesEmpty({ user, project }) {
  const o = user.licenseType == 'corporate' ? 'Batch' : 'Proyek';
  return (
    <div className="bg-green-50s text-center p-8 -mt-pxs">
      <h3 className="text-xl font-bold mb-6">
        {`${o} ini belum memiliki modul untuk dijalankan.`}
      </h3>
      <Link href={`/projects/${project._id}/setup-modules`}>
        <a className="inline-flex rounded border hover:border-gray-300 active:border-gray-400 px-6 py-2 text-blue-500 hover:text-blue-600">
          Setup modules &nbsp; &rarr;
        </a>
      </Link>
    </div>
  )
}