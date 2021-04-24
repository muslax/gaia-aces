/**
 * Project listing: id, title, client, admin
 */

 import { useLicense } from "hooks/useLicense";
import Link from "next/link";
 import Heading from "./Heading";

export default function License({ user }) {
  const { license, isError, isLoading } = useLicense();

  // if (isError || isLoading) return <></>;

  return <>
    <Heading title="License Info">
      {user.licenseOwner && <Link href="/new-user">
        <a className="inline-flex items-center bg-white shadow-sm hover:shadow rounded-sm px-4 h-8 border border-plum-500 hover:border-plum-600 text-sm text-plum-600 font-semibold">
          Upload Logo
        </a>
      </Link>}
    </Heading>
    <LicenseField
      label="License ID"
      description="Nomor lisensi"
      value={isLoading ? '000000000000000000000000' : license._id}
    />
    <LicenseField
      label="License Name"
      description="Nama pemilik lisensi"
      value={isLoading ? '...' : license.licenseName}
    />
    <LicenseField
      label="License Contact"
      description="Kontak/admin lisensi"
      value={isLoading ? '...' : license.contactName}
    />
    <LicenseField
      label="Publish Date"
      description="Tanggal mulai aktif"
      value={isLoading ? '...' : license.publishDate.substr(0, 10)}
    />
    <LicenseField
      label="Expiry Date"
      description="Tanggal akhir masa berlaku"
      value={isLoading ? '...' : license.expiryDate.substr(0, 10)}
    />
    <pre>
      {JSON.stringify(license, null, 2)}
    </pre>
  </>;
}

const LicenseField = ({ label, description, value }) => {
  return (
    <div className="flex flex-col sm:flex-row border-t py-4 text-sm">
      <div className="w-full sm:w-2/5 sm:pr-6">
        <div className="mr-12">
          <div className="text-sm text-plum-600 font-medium">{label}</div>
          <div className="text-xs text-gray-500 mb-2">
            {description}
          </div>
        </div>
      </div>
      <div className="w-full sm:w-3/5">
        <div className="w-full rounded border border-plum-200 bg-indigo-100 bg-opacity-25 text-plum-600s px-3 py-2 truncate">
          {value}
        </div>
      </div>
    </div>
  );
}