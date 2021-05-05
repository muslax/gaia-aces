import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { API } from "config";
import { ROUTES } from "config/routes";
import useClients from "hooks/useClients";
import fetchJson from "lib/fetchJson";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { mutate } from "swr";
import Heading from "./Heading";


export default function FormProject({ user }) {
  const router = useRouter();

  const { clients, isLoading } = useClients();
  const [clientOptions, setClientOptions] = useState([{
    _id: '',
    orgName: '- New Client',
    address: '',
    city: ''
  }])

  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [fullTitle, setFullTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  //
  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  const [selected, setSelected] = useState(clientOptions[0]);

  useEffect(() => {
    if (!clients) return;
    let array = clientOptions;
    clients.forEach(client => {
      array.push( client )
    });

    setClientOptions(array);
    setSelected(clientOptions[0]);
  }, [clients]);

  useEffect(() => {
    setClientId(selected._id)
    setClientName(selected._id ? selected.orgName : '')
    setClientCity(selected.city)
    setClientAddress(selected.address)
  }, [selected])

  if (isLoading) return <></>;

  function setClient(e) {
    const val = e.target.value;
    setSelected(val);
  }

  async function SubmitProject(e) {
    e.preventDefault();
    setSubmitting(true);

    const url = clientId ? `/api/post?q=${API.NEW_CLIENT_PROJECT}` :   `/api/post?q=${API.NEW_PROJECT}`;
    const response = await fetchJson(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        licenseId: user.licenseId,
        status: null,
        batchMode: 'single',
        title: title,
        fullTitle: fullTitle,
        description: description,
        startDate: startDate,
        endDate: endDate,
        admin: user.username,
        contacts: [],
        createdBy: user.username,
        //
        clientId: clientId,
        clientName: clientName,
        clientCity: clientCity,
        clientAddress: clientAddress,
      }),
    })

    if (response) {
      setSubmitting(false);
      mutate(`/api/get?q=${API.GET_PROJECTS}`);
      router.push(ROUTES.Dashboard);
    }
  }

  const input = "w-full text-sm rounded border border-gray-300 focus:border-plum-400 focus:ring focus:ring-indigo-50 px-3 py-2";

  return <>
    <Heading title="New Project">
      <Link href={ROUTES.Dashboard}>
        <a className="inline-flex items-center bg-white shadow-sm hover:shadow rounded-sm px-4 h-8 border border-red-400 hover:border-red-500 text-sm text-red-500 font-semibold">
          Cancel
        </a>
      </Link>
    </Heading>

    <div className="rounded-md border px-3 py-3">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-bs">
            <td colspan="2" className="px-2 py-2 text-lgs">
              Semua kolom harus diisi.
            </td>
          </tr>
          <tr className="border-bs">
            <td colspan="2" className="px-2">
              <div className={(submitting ? 'progress' : '') + " h-1 bg-gray-200s border-t border-gray-400"}></div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2 pt-5">Judul proyek:</td>
            <td className="p-2 pt-5">
              <input type="text"
                className={input}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Judul lengkap:</td>
            <td className="p-2">
              <input type="text"
                className={input}
                value={fullTitle}
                onChange={e => setFullTitle(e.target.value)}
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Deskripsi proyek:</td>
            <td className="p-2">
              <textarea
                className={input}
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Tanggal mulai kontrak:</td>
            <td className="p-2">
              <input type="text"
                className={input}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2 pb-4">Tanggal akhir kontrak:</td>
            <td className="p-2 pb-4">
              <input type="text"
                className={input}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-0 pl-2">
              <div className="flex items-center justify-center h-14 bg-gray-100 -ml-5 py-2">
              Pilih klien:
              </div>
            </td>
            <td className="p-0 pr-2">
              <div className="flex items-center h-14 rounded-r bg-gray-100 -mr-5 p-2 pr-5">

                <div className="w-full">
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded border border-gray-300 shadow-sm cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{selected.orgName}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  static
                  className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  {clientOptions.map((person, personIdx) => (
                    <Listbox.Option
                      key={personIdx}
                      className={({ active }) =>
                        `${
                          active
                            ? "text-amber-900 bg-amber-100"
                            : "text-gray-900"
                        }
                          cursor-default select-none relative py-2 pl-10 pr-4`
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`${
                              selected ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {person.orgName}
                          </span>
                          {selected ? (
                            <span
                              className={`${
                                active ? "text-amber-600" : "text-amber-600"
                              }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>


              </div>
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2 pt-4">Nama perusahaan/lembaga:</td>
            <td className="p-2 pt-4">
              <input type="text"
                className={input}
                value={clientName}
                disabled={clientId}
                onChange={e => setClientName(e.target.value)}
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Alamat:</td>
            <td className="p-2">
              <input type="text"
                className={input}
                value={clientAddress}
                disabled={clientId}
                onChange={e => setClientAddress(e.target.value)}
              />
            </td>
          </tr>
          <tr className="">
            <td width="25%" className="whitespace-nowrap p-2">Kota:</td>
            <td className="p-2">
              <input type="text"
                className={input}
                value={clientCity}
                disabled={clientId}
                onChange={e => setClientCity(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr className="">
            <td className="whitespace-nowrap p-3"></td>
            <td className="p-3 text-white">
              <button
                className="h-8 px-5 focus:outline-none rounded bg-indigo-400 hover:bg-indigo-500 active:bg-indigo-600 font-medium mr-3"
                onClick={SubmitProject}
              >
                Save Project
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    {/* <pre> {JSON.stringify(selected, null, 2)} </pre> */}
    {/* <pre> {JSON.stringify(clientOptions, null, 2)} </pre> */}
    <style jsx>
      {`
      .progress {
        background-image: url(/mango-in-progress-01.gif);
      }
      `}
    </style>
  </>;
}