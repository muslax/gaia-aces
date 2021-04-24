/**
 * Project listing: id, title, client, admin
 */

import useClients from "hooks/useClients";
import Link from "next/link";
import { useState } from "react";
import Heading from "./Heading";

export default function Clients({ user }) {
  const { clients, isLoading, isError } = useClients();

  const [viewStack, setViewStack] = useState([])

  if (isLoading) return <></>;

  return <>
    <Heading title="Daftar Klien" />
    <table className="w-full text-sm">
    <thead className="font-semibold">
        <tr className="border-b border-gray-300 border-opacity-50">
          <td className="w-9 p-0">
            <div className="rounded-tl-md bg-gray-200 bg-opacity-50 pt-4 pb-3 px-1">&nbsp;</div>
          </td>
          <td className="p-0">
            <div className="rounded-tr-md md:rounded-none bg-gray-200 bg-opacity-50 p-3 pt-4">Nama &amp; Email</div>
          </td>
          <td className="w-40 hidden md:table-cell w-36 text-center p-0">
            <div className="rounded-tr-md bg-gray-200 bg-opacity-50 p-3 pt-4">Proyek Terakhir</div>
          </td>
        </tr>
      </thead>
      <FakeRows />
      {clients.map(client => (
        <tbody key={client._id}>
          <tr
            className="border-b border-gray-200 hover:bg-gray-50"
            onClick={e => {
              if (viewStack.includes(client._id)) {
                setViewStack(vs => vs.filter(item => item !== client._id));
              } else {
                setViewStack(vs => ([...vs, client._id]))
              }
            }}
          >
            <td className="py-2 pl-3 text-center">
              <div className="mx-auto w-6 h-6 rounded-full bg-gray-300"></div>
            </td>
            <td className="px-3 py-2">
              <div className="font-medium truncate">
                {client.name}
              </div>
              <div className="text-gray-500 font-light">
                {client.city}
              </div>
            </td>
            <td className="hidden md:table-cell text-center text-gray-500 px-3 py-2">
              {client.projects[0].startDate}
            </td>
          </tr>
          {viewStack.includes(client._id) && (
            <tr className="border-b border-gray-200 bg-gray-50 bg-opacity-50">
              <td className="py-2 pl-3 text-center"></td>
              <td colSpan="2" className="p-3">
                <ClientInfo client={client} />
              </td>
            </tr>
          )}
        </tbody>
      ))}
    </table>
    <pre>
      {/* {JSON.stringify(clients, null, 2)} */}
    </pre>
  </>;
}

function FakeRows() {
  return (
  <tbody>
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-2 pl-3 text-center">
        <div className="mx-auto w-6 h-6 rounded-full bg-gray-300"></div>
      </td>
      <td className="px-3 py-2">
        <div className="font-medium truncate">
          PT Saloka Indah Perkasa
        </div>
        <div className="text-gray-500 font-light">
          Jakarta
        </div>
      </td>
      <td className="hidden md:table-cell text-center text-gray-500 px-3 py-2">
        Agustus 2020
      </td>
    </tr>
    <tr className="border-b border-gray-200">
      <td className="py-2 pl-3 text-center">
        <div className="mx-auto w-6 h-6 rounded-full bg-green-200"></div>
      </td>
      <td className="px-3 py-2">
        <div className="font-medium truncate">
          Potential Review Level Supervisor
        </div>
        <div className="text-gray-500 font-light">
          PT Saloka Indah Perkasa
        </div>
      </td>
      <td className="hidden md:table-cell text-center text-gray-500 px-3 py-2">
        Februari 2020
      </td>
    </tr>
  </tbody>
  )
}

function ClientInfo({ client }) {
  return (
    <table className="">
      <tbody className="align-top">
        <tr>
          <td className="w-20 text-gray-500 py-1">
            Alamat:
          </td>
          <td className="text-gray-700 py-1">
            {client.address}
          </td>
        </tr>
        <tr>
          <td className="text-gray-500 py-1">
            Kota:
          </td>
          <td className="text-gray-700 py-1">
            {client.city}
          </td>
        </tr>
        <tr>
          <td className="text-gray-500 py-1">
            Telepon:
          </td>
          <td className="text-gray-700 py-1">
            {client.phone}
          </td>
        </tr>
        <tr>
          <td className="text-gray-500 py-1">
            Proyek:
          </td>
          <td className="py-1">
            {client.projects.map(project => <div key={project._id}>
              <Link href={`/projects/${project._id}`}>
                <a className="text-blue-500 hover:text-blue-600 leading-relaxed">
                  {project.title}
                  {project.startDate && (
                    <span className="ml-3">
                      ({project.startDate.substr(0, 4)})
                    </span>
                  )}
                </a>
              </Link>
            </div>)}
          </td>
        </tr>
      </tbody>
    </table>
  )
}